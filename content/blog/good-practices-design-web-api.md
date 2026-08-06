---
title: Buenas prácticas en el diseño de una API web
description: Sustantivos en lugar de verbos, filtros detrás del signo de interrogación, errores que se entienden y versionado desde el día uno. Los criterios que hacen que una API web se use sin pelear.
date: "2023-11-04"
time: 10 min
tags:
  - Desarrollo
  - API
  - Buenas prácticas
author: RrQq
---

El cliente de tu API no es un navegador ni una app: es otro desarrollador, con su propio deadline encima. El éxito de una API web se mide en qué tan rápido esa persona logra hacer algo útil con ella sin escribirte por WhatsApp.

**REST** es un estilo arquitectónico, no un estándar estricto. Eso te da libertad, y la libertad mal usada es justamente el problema: cada quien inventa su propia forma y el resultado es una API que parece combi, con paraderos donde el chofer quiso.

Lo que sigue son criterios que funcionan. No son ley, pero si te apartas de ellos, que sea a propósito.

## Sustantivos sí, verbos no

### Mantén los verbos fuera de tus URL

Cuando modelas un recurso, digamos `dogs`, nunca vive aislado: hay dueños, veterinarios, vacunas. Si empiezas a meter el verbo en la ruta, terminas con esto:

| /getAllDogs | /verifyVeterinarianLocation |
| ----------- | --------------------------- |
| /newDogs    | /getAllLesshedDogs          |
| ...         | ...                         |

Es una pendiente resbalosa. En dos sprints tienes una lista larguísima de URLs y ningún patrón que las explique.

### Una URL base por recurso, en plural

Solo deberías necesitar dos formas por recurso:

- `/dogs`
- `/dogs/1234`

### Usa los verbos HTTP para operar sobre ellas

Con esos dos recursos y cuatro verbos ya cubres todo el CRUD:

| Recurso    | **POST**         | **GET**                   | **PUT**                 | **DELETE**                 |
| ---------- | ---------------- | ------------------------- | ----------------------- | -------------------------- |
| /dogs      | Crear un recurso | Listar todos los recursos | Actualizar todos (raro) | Eliminar todos (peligroso) |
| /dogs/1234 | --               | Obtener un recurso        | Actualizar un recurso   | Eliminar un recurso        |

Dos advertencias sobre esa tabla. `PUT` y `DELETE` sobre la colección completa casi nunca son lo que quieres exponer: si no tienes un caso de uso real, no los implementes. Y para actualizaciones parciales usa `PATCH`, no `PUT`: `PUT` significa "reemplaza el recurso entero con esto", y si el cliente omite un campo, se lo estás borrando.

### Devuelve el recurso

Cada vez que creas o actualizas algo, devuelve el recurso resultante. Obligar al cliente a hacer un `GET` extra para saber qué quedó guardado es una llamada de red por las puras.

## Relaciones y parámetros de consulta

### Las relaciones se leen como pertenencia

Los recursos casi siempre se relacionan con otros. Modela esa relación como pertenencia:

- **GET** `/owners/5678/dogs` — todos los perros de ese dueño
- **GET** `/owners/5678/dogs/123` — un perro específico de ese dueño
- **POST** `/owners/5678/dogs` — crear un perro para ese dueño

Una vez que tienes el sustantivo principal de un nivel, ya no necesitas arrastrar los anteriores: `/dogs/123` te sirve igual si el id es único. Rara vez vas a necesitar más de **dos niveles** de profundidad. Si te pasa seguido, probablemente el recurso anidado merece ser un recurso de primer nivel.

### Todo lo opcional va detrás del `?`

Los estados, filtros y atributos opcionales van en el query string. La URL base se mantiene simple y predecible:

**Filtros**

```http
GET /dogs?color=red&state=running&location=park
```

**Ordenamiento**

```http
GET /dogs?sort=-created,-updated
```

El guion delante del campo indica descendente. Es una convención bastante extendida y le ahorra al cliente aprenderse un `order=desc` aparte.

**Búsqueda**

```http
GET /dogs?name__icontains=a
```

## Respuesta parcial y paginación

### Respuesta parcial

Deja que el cliente pida solo los campos que necesita:

```http
GET /dogs/1234?fields=id,name,picture
```

Sirve para no mandar payloads gigantes a un móvil con datos contados. Ojo: si tu caso de uso principal es "cada cliente necesita una forma distinta de los datos", puede que el problema real sea que **GraphQL** te calza mejor que REST.

### Paginación

Devolver todos los registros de una tabla es una mala idea, siempre. Dos enfoques:

```http
GET /dogs?limit=25&offset=50    # simple, se rompe al paginar datos que cambian
GET /dogs?cursor=eyJpZCI6MTIzfQ # estable aunque se inserten filas mientras paginas
```

`limit`/`offset` es más fácil de implementar y de entender. El problema aparece en tablas con escritura frecuente: si alguien inserta un registro mientras el cliente pasa de la página 2 a la 3, un elemento se repite o se pierde. Para listados grandes y activos, paginación por cursor.

**De cajón:** pon un límite máximo por página del lado del servidor. Si no, alguien va a mandar `?limit=1000000` y te va a tumbar la base.

## Errores, versiones y subdominio

### Usa códigos de estado HTTP, pero los comunes

Existen más de 70 códigos de estado. Casi nadie se los sabe todos. Si eliges uno exótico, obligas al desarrollador a dejar de programar y ponerse a buscar qué le quisiste decir.

Sé explícito con los de siempre: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429` y `500`. Con eso cubres casi todo.

Dos que valen la pena tener presentes:

- **`409 Conflict`** para choques de estado, como intentar crear algo que ya existe.
- **`429 Too Many Requests`** cuando el cliente pasa el límite, acompañado de la cabecera `Retry-After` para que sepa cuánto esperar en vez de reintentar a ciegas.

### Que el cuerpo del error también se entienda

El código de estado dice la categoría; el cuerpo dice qué pasó. Mantén una sola forma para todos tus errores:

```json
{
  "type": "https://api.ejemplo.com/errors/validation",
  "title": "Los datos enviados no son válidos",
  "status": 422,
  "detail": "El campo 'email' ya está registrado",
  "errors": [{ "field": "email", "code": "unique" }]
}
```

Esa forma sigue el **RFC 9457 (Problem Details)**. No es obligatorio adoptarlo al pie de la letra, pero tener un formato único y documentado te evita que cada endpoint devuelva el error a su manera.

### Versiona desde el día uno

Nunca publiques una API sin versión, y haz que la versión sea obligatoria. Prefijo `v` y bien a la izquierda:

```http
GET /v1/dogs
```

### ¿Versión en la URL o en las cabeceras?

A veces se pone la versión en la cabecera porque hay varias APIs interdependientes. Suele ser síntoma de otra cosa: se está exponiendo el desorden interno en lugar de construir una fachada usable encima.

Si el cambio afecta a la lógica que el cliente escribe para manejar la respuesta, ponlo en la URL, donde se ve. Depurar es mucho más fácil cuando la versión aparece en el log de acceso.

Cuando vayas a retirar una versión, avísalo por la cabecera `Sunset` con la fecha, y documenta la ruta de migración. Apagar un `/v1` sin aviso es la forma más rápida de quemar la confianza de quien te integró.

### Consolida la API en un subdominio

Es más limpio e intuitivo para quien va a construir sobre lo tuyo:

- `api.ejemplo.com`

## La yapa

### CamelCase, PascalCase o snake_case

## ::custom-image

url: "https://imgb.ifunny.co/images/7042ff298998e2ea8c70c35478541672166ec90170125b7479daa11ae234df37_1.jpg"
alt: "Meme sobre la discusión eterna entre camelCase y snake_case"
max-width: 400

---

::

Así responden algunas APIs conocidas:

- **Bing** — `"DateTime": "2011-10-29T09:35:00Z"`
- **Foursquare** — `"createdAt": 1320296464`
- **Twitter** — `"created_at": "Thu Nov 03 05:19:38 +0000 2011"`

**No hay una convención única.** El argumento a favor de `camelCase` es que el consumidor final suele ser JavaScript, y ahí `createdAt` se lee como código nativo. Si tu backend es Python, vas a escribir `snake_case` de todas formas y necesitarás una capa que traduzca en los bordes.

Lo que sí es innegociable: **elige una y sé consistente en toda la API**. Lo peor que puedes hacer es mezclar.

Sobre fechas, ahí sí hay respuesta correcta: **ISO 8601 en UTC** (`2011-10-29T09:35:00Z`). Ese formato de Twitter del ejemplo es un dolor de cabeza para parsear en cualquier lenguaje.

### Autenticación

Las aplicaciones que exponen APIs **no tienen por qué compartir contraseñas**. Con tokens, el proveedor puede **revocar el acceso** de un usuario o de una aplicación entera sin obligar a nadie a cambiar su contraseña original.

Eso es fundamental cuando un dispositivo se pierde o cuando detectas una aplicación no autorizada. Hoy el camino estándar es **OAuth 2.0** con tokens de vida corta y refresh token, o JWT firmados si controlas ambos extremos.

### TLS, sin excepciones

## ::custom-image

url: "https://media.makeameme.org/created/ssl-ssl-everywhere-5bc9c7.jpg"
alt: "Meme de Buzz Lightyear: SSL, SSL everywhere"
max-width: 400

---

::

Vas a intercambiar información sensible, empezando por los propios tokens. Con **Let's Encrypt** los certificados son gratis y se renuevan solos, así que ya no queda ni la excusa del presupuesto. Y no aceptes la misma petición por HTTP "por si acaso": un token que viajó en claro una sola vez ya está comprometido.

### Caché

## ::custom-image

url: "https://miro.medium.com/v2/resize:fit:750/1*TRpMZdbDrdZxAOwWTZ_Kgw.jpeg"
alt: "Meme sobre invalidación de caché"
max-width: 400

---

::

Cachear es guardar el resultado de un cálculo caro para no repetirlo la próxima vez. No hagas las mismas consultas una y otra vez.

En HTTP tienes dos herramientas que ya vienen resueltas: `ETag` con `If-None-Match`, y `Cache-Control` con su `max-age`. Cuando el recurso no cambió, respondes `304 Not Modified` sin cuerpo y te ahorras el ancho de banda completo.

### Limita las solicitudes

Los limitadores controlan la tasa de peticiones que un cliente puede hacer. Comunica el estado en cabeceras (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`) para que el cliente pueda autorregularse en lugar de descubrir el límite a la mala, chocándose con un `429`.

### Documenta con OpenAPI

Si tu API no tiene documentación navegable, no existe. Genera un esquema **OpenAPI** desde el código, no a mano, porque la documentación escrita aparte se desactualiza en la primera semana. En Django Rest Framework, `drf-spectacular` lo genera desde tus serializers y vistas.

---

##### Basado en la guía de diseño de APIs web de [Apigee](https://pages.apigee.com), con criterios actualizados.
