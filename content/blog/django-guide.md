---
title: Guía de principios en Django con Rest Framework
description: Dónde poner la lógica de negocio, cómo nombrar las cosas y qué librerías valen la pena en un proyecto Django con Rest Framework. Los consensos que evitan discutir lo mismo en cada code review.
date: "2023-12-08"
time: 12 min
tags:
  - Desarrollo
  - API
  - Django
  - Buenas prácticas
author: RrQq
---

Esta guía no pretende ser una verdad absoluta. Es un conjunto de acuerdos para que un equipo deje de discutir lo mismo en cada revisión de código y para que cualquiera pueda entrar a un proyecto y saber dónde buscar.

## ¿Qué buscamos establecer?

- Buenas prácticas para el manejo de información dentro de un proyecto Django.
- Un lugar claro y predecible donde vive la **lógica de negocio**.
- Código legible, que cualquier persona del equipo pueda modificar sin miedo.
- Consensos explícitos, para que las decisiones no dependan de quién hizo el commit.

## Cookiecutter Django

Para proyectos nuevos partimos de la plantilla [cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django). Nuestras elecciones habituales:

- Proveedor de nube: **AWS**.
- **Docker** desde el inicio.
- Servidor de correo: otro SMTP.
- Sin compresor, sin whitenoise y sin Sentry (los proyectos no son open source).
- Normalmente sacamos `django-debug-toolbar` de la configuración local.

## Antes de escribir código

### Linter y formateador

La plantilla ya viene con las herramientas configuradas. Hoy eso significa **[Ruff](https://docs.astral.sh/ruff/)**, que reemplaza a Flake8 y a Black en una sola herramienta y corre bastante más rápido.

Si vienes de proyectos con Flake8 + Black + isort por separado, el cambio no es traumático: las reglas son las mismas, la configuración se unifica en `pyproject.toml`.

```toml [pyproject.toml]
[tool.ruff]
line-length = 129

[tool.ruff.lint]
select = ["E", "F", "I", "DJ", "UP"]
```

Configura tu editor (PyCharm o VS Code) para que al guardar revise la sintaxis y formatee. Es la diferencia entre discutir espacios en un PR y no volver a hablar del tema.

La otra red de seguridad es **pre-commit**, que corre esas mismas herramientas antes de dejarte commitear:

```sh [Terminal]
pre-commit install
```

Lo que se ejecuta está en `.pre-commit-config.yaml`. Si quieres agregar o quitar algo, es ahí.

### Cómo nombramos las cosas

**Las aplicaciones de Django** agrupan modelos relacionados. Van en **plural** y **minúsculas**: `users`.

Los **modelos** en **singular** y **PascalCase**: `Ticket`.

Los **campos** en **singular** y **snake_case**: `price_type`.

Las **funciones** empiezan con un verbo y van en **snake_case**: `get_related_tickets`.

Esa última regla aplica también a las tareas de Celery y a los métodos de los serializers. Es fácil que se cuele un `sendEmail` cuando vienes de escribir JavaScript el mismo día.

## Configuración

Sobre lo que trae Cookiecutter, agregamos estas librerías.

### Django CamelCase

[djangorestframework-camel-case](https://github.com/vbabiy/djangorestframework-camel-case) traduce entre el `snake_case` de Python y el `camelCase` que espera el front, en los dos sentidos.

```py [settings.py]
REST_FRAMEWORK = {
    ...
    "DEFAULT_RENDERER_CLASSES": ("djangorestframework_camel_case.render.CamelCaseJSONRenderer",),
    "DEFAULT_PARSER_CLASSES": (
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
    ),
    "JSON_UNDERSCOREIZE": {
        "no_underscore_before_number": True,
    },
    "COERCE_DECIMAL_TO_STRING": False,
}
```

Un detalle que muerde: `COERCE_DECIMAL_TO_STRING = False` hace que los decimales viajen como números JSON. Gana comodidad en el front y pierdes precisión en montos grandes, porque JSON usa punto flotante. Si estás modelando plata, piénsalo dos veces antes de copiarlo.

### Dj Rest Auth

[dj-rest-auth](https://github.com/iMerica/dj-rest-auth) te da los endpoints de autenticación resueltos. Si necesitas cambiar un serializer, la configuración va agrupada bajo `REST_AUTH`:

```py [settings.py]
REST_AUTH = {
    "LOGIN_SERIALIZER": "folder_api.users.api.serializers.MyLoginSerializer",
}
```

> Si encuentras ejemplos con `REST_AUTH_SERIALIZERS` en un diccionario aparte, son de versiones antiguas. Esa forma quedó obsoleta.

### Django Model Utils

[django-model-utils](https://github.com/jazzband/django-model-utils) trae utilidades para modelos y campos. La que más usamos es el modelo abstracto que maneja fechas de creación y modificación:

```py [models.py]
from model_utils.models import TimeStampedModel
from model_utils.fields import UUIDField

class Ticket(TimeStampedModel):
    uuid = UUIDField(primary_key=True, version=4, editable=False)
    ...
```

### Filtros por URL

Para filtrar por campos y relaciones desde el query string usamos **[django-filter](https://django-filter.readthedocs.io/)**.

```py [views.py]
from django_filters.rest_framework import DjangoFilterBackend

class TicketViewSet(GenericViewSet):
    ...
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["uuid", "code"]

    @action(detail=False, methods=["GET"])
    def defeated(self, request):
        tickets = self.filter_queryset(self.get_queryset())
        ...
```

> En proyectos viejos vas a encontrar `django-url-filter` con `filter_fields`. Está sin mantenimiento hace años; en proyectos nuevos, `django-filter`.

### Storages

[django-storages](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html) conecta los archivos de Django con S3, Azure o GCS. La configuración la mantenemos en `utils/storages.py`.

Desde Django 4.2 los backends se declaran en `STORAGES`:

```py [settings.py]
STORAGES = {
    "default": {"BACKEND": "folder_api.utils.storages.PublicMediaS3Boto3Storage"},
    "staticfiles": {"BACKEND": "folder_api.utils.storages.StaticRootS3Boto3Storage"},
}
```

Y las clases:

```py [storages.py]
class StaticRootS3Boto3Storage(S3Boto3Storage):
    location = "static"

class PublicMediaS3Boto3Storage(S3Boto3Storage):
    location = "media"
    file_overwrite = False

class PrivateMediaS3Boto3Storage(S3Boto3Storage):
    location = "media-private"
    file_overwrite = False
    querystring_auth = True
    querystring_expire = 60 * 60 * 12
    region_name = "us-east-2"
```

**Cuidado con las ACL.** Los ejemplos que circulan usan `default_acl = "public-read"`. Los buckets creados hoy vienen con las ACL deshabilitadas por defecto (_Bucket owner enforced_), así que esa línea revienta al subir el archivo. El acceso público se resuelve con una **policy del bucket**, no con la ACL del objeto.

Para los archivos privados necesitas un `handler` que no te complique el desarrollo local ni las migraciones:

```py [storages.py]
def handler_private_storage():
    if settings.DEBUG:
        return None
    return PrivateMediaS3Boto3Storage()
```

```py [models.py]
class Ticket(TimeStampedModel):
    ...
    image = models.FileField(..., storage=handler_private_storage)
```

Pasa la función **sin llamarla**: Django la evalúa de forma perezosa y así el backend no queda congelado dentro de la migración.

## Modelos

Vamos con un ejemplo. La **lógica de negocio** dice que muchos usuarios pueden usar un ticket.

```py [models.py]
class User(TimeStampedModel):
    ...
    name = models.CharField(max_length=32)

class Ticket(TimeStampedModel):
    code = models.CharField(max_length=10, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    usage_limit = models.PositiveSmallIntegerField(default=1)

    # created y modified los aporta TimeStampedModel
```

Primero definimos qué tendrá el modelo: campos, valores únicos, consultas, propiedades y métodos.

### Managers

Los managers permiten crear consultas reutilizables y controlar cómo se crean las instancias.

Para el ejemplo tenemos tres campos: `code`, `user` y `usage_limit`. El `code` es único y debe generarse una sola vez, al crear. Ahí hay dos caminos:

- Poner la lógica en `save()`. Sirve cuando el valor se recalcula **cada vez** que guardas.
- Usar un **manager** con un `create()` propio, que corre **solo al crear**.

Como el código no debe cambiar nunca más, el manager es lo correcto:

```py [managers.py]
class TicketManager(models.Manager):

    CODE_LENGTH = 10

    def create(self, *args, **kwargs):
        code = generate_random_code(self.CODE_LENGTH)
        while self.filter(code=code).exists():
            code = generate_random_code(self.CODE_LENGTH)
        kwargs["code"] = code
        return super().create(*args, **kwargs)
```

Ese `while` tiene una condición de carrera: entre el `exists()` y el `create()` otro proceso puede insertar el mismo código. Con `unique=True` la base te protege igual, pero conviene atrapar el `IntegrityError` y reintentar.

La función `generate_random_code(length)` vive en `utilities.py`, porque es una utilidad y no pertenece a ningún modelo:

```console
folder_api
├── users
├── utils
│   ├── __init__.py
│   ├── utilities.py
│   ├── storages.py
│   └── validators.py
|   ...
...
```

Los managers también sirven para nombrar consultas que se repiten. [Más información](https://docs.djangoproject.com/en/stable/topics/db/managers/#custom-managers).

```py [managers.py]
class TicketManager(models.Manager):
    ...
    def tickets_starting_with_a(self):
        return self.get_queryset().filter(code__istartswith="a")
```

## Dónde va cada función

La regla corta: **si la operación necesita una instancia, es un método del modelo**.

Búsqueda compleja de objetos relacionados desde una instancia:

```py [models.py]
from django.contrib.postgres.search import TrigramSimilarity

class Ticket(TimeStampedModel):
    ...
    def get_related_tickets(self):
        return (
            Ticket.objects.annotate(similarity=TrigramSimilarity("code", self.code))
            .order_by("-similarity")
            .filter(similarity__gt=0.2)
            .exclude(id=self.id)
        )
```

> Los paréntesis alrededor del queryset no son decoración: sin ellos el encadenamiento en varias líneas es un error de sintaxis.

Operación sobre una sola instancia:

```py [models.py]
class User(TimeStampedModel):
    ...
    def get_tickets(self):
        return self.tickets.all()
```

Operación sobre una instancia que además necesita datos externos:

```py [models.py]
class Ticket(TimeStampedModel):
    ...
    def get_user_used(self, user):
        return self.user_id == user.id
```

Y cuando la lógica pertenece al modelo pero no a una instancia concreta, un `staticmethod`:

```py [models.py]
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector

class Ticket(TimeStampedModel):
    ...
    @staticmethod
    def get_filtered_tickets(code):
        # Ranking por relevancia, no solo coincidencia
        vector = SearchVector("code")
        return Ticket.objects.annotate(rank=SearchRank(vector, SearchQuery(code))).order_by("-rank")
```

### Property

El decorador `@property` es para devolver variaciones de campos que ya existen. Nada de consultas adentro: un `property` que va a la base se convierte en un problema de N+1 apenas lo uses en un serializer sobre una lista.

```py [models.py]
class Ticket(TimeStampedModel):
    ...
    @property
    def code_upper(self):
        return self.code.upper()

    @property
    def days_since_creation(self):
        today = timezone.localdate()
        return (today - self.created.date()).days
```

## Django Rest Framework

### Estructura de carpetas

Dentro de cada aplicación va una carpeta `api` con sus archivos:

```console
users
├── __init__.py
├── api
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
|   ├── pagination.py
│   ...
...
```

En `urls.py`, el `router.urls` de DRF debe ser el mismo que `urlpatterns`. En `api_router.py` incluyes la referencia de cada `urls.py`:

```py [urls.py]
from django.urls import include

urlpatterns += [
    ...
    path("", include("folder_api.app.api.urls")),
]
```

## Próximos pasos

### Celery

Cookiecutter ya trae Celery configurado. En cada aplicación defines un `tasks.py` con las funciones que corren en segundo plano, decoradas con `@celery_app.task`:

```py [tasks.py]
from config.celery_app import app as celery_app

@celery_app.task
def send_email(user_id):
    ...
    msg = EmailMultiAlternatives(...)
    msg.send()
```

Para usarlas, llamas a la función con `delay()`:

```py [serializers.py]
from folder_api.users.tasks import send_email

class SignUpSerializer(serializers.Serializer):
    ...
    def create(self, validated_data):
        ...
        send_email.delay(user.id)
        ...
```

Fíjate que se pasa `user.id` y no el objeto `user`. La tarea viaja serializada hasta el worker, así que manda identificadores y vuelve a consultar allá; si mandas el objeto completo, el worker puede terminar trabajando con datos viejos.

**Nota:** para tareas periódicas desde el admin, [django-celery-beat](https://github.com/celery/django-celery-beat).
