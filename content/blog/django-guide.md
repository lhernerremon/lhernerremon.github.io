---
title: Guía de principios en Django con Rest Framework
description: Conjunto de principios y consensos para establecer un estándar en el desarrollo de software con Django y Django Rest Framework.
date: 2023-12-08
time: 8 min
tags:
  - Desarrollo
  - API
  - Django
author: RrQq
---

El objetivo de esta guía no es mostrar una verdad absoluta, sino mostrar un conjunto de principios y consensos para establecer un estándar en el desarrollo de software con Django y Django Rest Framework.

## ¿Qué es lo que buscamos establecer?

- Establecer buenas prácticas para el manejo de información dentro de un proyecto django.
- Establecer un lugar claro para colocar la 'lógica empresarial'.
- Mantenga el código limpio y fácil de leer. Y que cualquier desarrollador del equipo podrá modificar, actualizar, etc.
- Establecer consensos para el desarrollo de proyectos de manera transparente.

## Django Cookiecutter

Para proyectos Django, utilizamos la estructura de [Pydanny](https://github.com/cookiecutter/cookiecutter-django){:target="\_blank"}.

- En cuanto al proveedor de la nube, utilizamos AWS.
- Usamos Docker.
- Respecto al servidor de correo, otro SMTP.
- De momento no utilizamos ningún compresor, los proyectos no son open source, ni whitenoise ni sentry.
- Normalmente eliminamos la biblioteca django-debug-toolbar de la configuración del proyecto local.

## Considerar

### Configuración previa

En la documentación de [Django Cookiecutter](https://github.com/cookiecutter/cookiecutter-django){:target="\_blank"}. viene configurado con un linter como [Flake8](https://pypi.org/project/flake8/){:target="\_blank"} y con un formateador como [Black](https://pypi.org/project/black/){:target="\_blank"}.

Para aprovechar el uso del linter Flake8(PyCharm, VsCode), necesitamos configurar nuestro editor de código para usar este linter para Python. Lo mismo ocurre con Black ([PyCharm](https://black.readthedocs.io/en/stable/integrations/editors.html#pycharm-intellij-idea){:target="\_blank"} y [VsCode](https://dev.to/adamlombard/how-to-use-the-black-python-code-formatter-in-vscode-3lo0){:target="\_blank"}).

- Lo ideal es que al guardar un cambio se revise la sintaxis y se formatee nuestro código.
- Con negro utilizamos 129 caracteres como longitud de línea.
- Otra forma de utilizar la sintaxis de verificación es mediante la confirmación previa.
- Para activar la configuración previa a la confirmación en el proyecto, ejecute este comando:

```sh [Terminal] meta-info=val
pre-commit install
```

En general se ejecutan módulos como flake8, isort, black, etc. Si desea cambiar algo de esto, consulte el archivo `.pre-commit-config.yaml`.

### Información previa

**El Directorio de Aplicaciones de Django** guarda los modelos que están relacionados, debe escribirse en **plural** y en **minúsculas**. Por ejemplo `users`.

Los nombres de los **modelos** deben estar en **singular** y en **PascalCase**. Por ejemplo `Ticket`.

**Los campos** deben ser **singulares** y estar en **Snake_case**. Por ejemplo `price_type`.

**Las funciones** deben comenzar con un verbo y estar en **snake_case**. Por ejemplo `get_related_tickets`.

## Configuración

En cuanto a la configuración predeterminada de Django Cookiecutter, agregamos algunas bibliotecas relacionadas como estas:

### Django CamelCase

[Django REST Framework JSON CamelCase](https://github.com/vbabiy/djangorestframework-camel-case){:target="\_blank"} para obtener una salida y entrada del analizador Json con formato CamelCase.

```py [settings.py] meta-info=val
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

### Dj Rest Auth

[Dj-Rest-Auth](https://github.com/iMerica/dj-rest-auth){:target="\_blank"} nos proporciona puntos finales API directos para manejar de forma segura la autenticación en Django.
Si necesitamos cambiar un [serializador](https://dj-rest-auth.readthedocs.io/en/latest/configuration.html){:target="\_blank"} predeterminado, podemos usar:

```py [settings.py] meta-info=val
REST_AUTH_SERIALIZERS = {
    "LOGIN_SERIALIZER": "folder_api.users.api.serializers.MyLoginSerializer",
}
```

### Django Model Utils

[Django Model Utils](https://github.com/jazzband/django-model-utils){:target="\_blank"} nos proporciona utilidades para modelos y campos. Entre estos tenemos un modelo abstracto para manejar las fechas de creación y modificación.

```py [models.py] meta-info=val
from model_utils.models import TimeStampedModel
from model_utils.fields import UUIDField

class Ticket(TimeStampedModel):
  uuid = UUIDField(primary_key=True, version=4, editable=False)
  ...
```

### Django URL Filter

[Django Url Filter](https://pypi.org/project/django-url-filter/){:target="\_blank"} nos proporciona una interfaz URL simple para filtrar datos, entre campos y relaciones.

- Si necesitas agregarlo dentro de una acción, puedes hacerlo de esta manera:

```py [views.py] meta-info=val
from url_filter.integrations.drf import DjangoFilterBackend

class TicketViewSet(GenericViewSet):
    ...
    filter_backends = [DjangoFilterBackend]
    filter_fields = ["uuid"]
    ...
    @action(detail=False, methods=["GET"])
    def defeated(self, request):
        productos = self.filter_queryset(self.get_queryset())
        ...
```

### Storages

[Django Storages](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html){:target="\_blank"} nos proporciona un conjunto de backends de almacenamiento para Django. Estos backends proporcionan compatibilidad con el almacenamiento de archivos en Amazon S3, Azure Storage, Google Cloud Storage, etc.

La configuración la podemos mantener dentro de un archivo `storages.py` dentro de la carpeta utils.

- Generalmente permitimos que los archivos estáticos sean legibles públicamente:

```py [settings.py] meta-info=val
class StaticRootS3Boto3Storage(S3Boto3Storage):
    location = "static"
    default_acl = "public-read"
```

- En el caso de mantener los archivos multimedia legibles públicamente:

```py [settings.py] meta-info=val
class PublicMediaS3Boto3Storage(S3Boto3Storage):
    location = "media"
    default_acl = "public-read"
    file_overwrite = False
```

- Pero en caso de que necesite crear una carpeta con archivos multimedia privados.

```py [settings.py] meta-info=val
class PrivateMediaS3Boto3Storage(S3Boto3Storage):
    location = "media-private"
    default_acl = "private"
    file_overwrite = False
    querystring_auth = True
    querystring_expire = 60 * 60 * 12
    region_name = "us-east-2"
```

**Nota:** También necesita un `handler` y usarlo para cada campo en el que lo usará.

- Deberá crear uno nuevo, como este:

```py [settings.py] meta-info=val
def handlerPrivateStorage():
    if settings.DEBUG:
        return None
    return PrivateMediaS3Boto3Storage()
```

- Y dentro del modelo usarlo de esta manera para no afectar los archivos de desarrollo local y migración.

```py [models.py] meta-info=val
class Ticket(TimeStampedModel):
    ...
    image = models.FileField(..., storage=handlerPrivateStorage())
```

## Modelos

Para hacer algunas demostraciones, mostraremos un ejemplo. La **lógica del negocio** nos dice que muchos usuarios pueden utilizar un ticket.

```py [models.py] meta-info=val
class Ticket(TimeStampedModel):
    code = models.CharField(max_length=10, unique=True)
    user = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="tickets")
    usage_limit = models.PositiveSmallIntegerField(default=1)

    # created: Is a field provided by TimeStampedModel
    # modified: Is a field provided by TimeStampedModel

class User(TimeStampedModel):
    ...
    name = models.CharField(max_length=32)

    # created: Is a field provided by TimeStampedModel
    # modified: Is a field provided by TimeStampedModel
```

Primero debemos definir algunas características que tendrán los modelos, tales como: campos, valores únicos, consultas, propiedades y métodos.

### Managers

Los managers nos permiten crear consultas personalizadas para nuestros modelos. Por ejemplo, si queremos obtener todos los tickets que no han sido utilizados, podemos crear un manager personalizado para esto.

- Para definir los campos necesitamos toda la información sobre el funcionamiento del negocio, para este ejemplo tendremos solo estos: `code`, `user` y `usage_limit`.
- El modelo Ticket tiene un campo que es único y debe ser creado y asignado a cada instancia una sola vez, para esto tenemos 2 opciones.
  - Coloque esa lógica en el método `save()`, que se utiliza mejor cuando tenemos un valor que necesitamos recalcular o generar cada vez que guardamos cambios en el modelo.
  - Utilizar los `manager de Django`, que nos permite utilizar un método `create()`, que se ejecutará solo una vez.

```py [manager.py] meta-info=val
class TicketManager(models.Manager):

    CODE_LENGTH = 10

    def create(self, *args, **kwargs):
        code = generate_random_code(self.CODE_LENGTH)
        while self.filter(code=code).exists():
            code = generate_random_code(self.CODE_LENGTH)
        kwargs["code"] = code
        return super().create(*args, **kwargs)
```

**Nota:** Para acceder a la función `generate_random_code(length),` debemos colocarla dentro de `utilities.py` ya que es una función de utilidad.

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

Los `manager de Django` también se pueden utilizar para definir consultas que se utilizarán constantemente. [Más información](https://docs.djangoproject.com/en/4.2/topics/db/managers/#custom-managers){:target="\_blank"}.

```py [manager.py] meta-info=val
class TicketManager(models.Manager):
    ...
    def tickets_starting_with_a(self):
        return self.get_queryset().filter(code__istartswith="a")

    def tickets_starting_with_b(self):
        return self.get_queryset().filter(code__istartswith="b")
    ...
```

## Funciones

Las funciones son una forma de encapsular la lógica de negocio que no pertenece a un modelo específico.

Si necesita una búsqueda más compleja de objetos relacionados desde una única instancia del modelo, hágalo como un método dentro de la clase del modelo.

```py [models.py] meta-info=val
from django.contrib.postgres.search import TrigramSimilarity

class Ticket(TimeStampedModel):
    ...
    def get_related_tickets(self):
        return Ticket.objects.annotate(similarity=TrigramSimilarity("code", self.code))
            .order_by("-similarity")
            .filter(similarity__gt=0.2)
            .exclude(id=self.id)
```

Si necesita desarrollar la lógica para alguna operación para una única instancia del modelo, hágalo como un método dentro de la clase del modelo.

```py [models.py] meta-info=val
class User(TimeStampedModel):
    ...
    def get_tickets(self):
        return self.tickets.all()
```

Si necesita desarrollar la lógica para alguna operación para una única instancia de modelo y también necesita campos adicionales, hágalo como un método dentro de la clase de modelo.

```py [models.py] meta-info=val
class Ticket(TimeStampedModel):
    ...
    def get_user_used(self, user):
        return self.user_id == user.id
```

Si necesita desarrollar lógica para cualquier instancia del modelo, pero está relacionada con el modelo, hágalo como un método dentro de la clase del modelo.

```py [models.py] meta-info=val
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector

class Ticket(TimeStampedModel):
    ...
    @staticmethod
    def get_filtered_tickets(code):
        # Search and ranking to order by relevance
        vector = SearchVector("code")
        return Ticket.objects.annotate(rank=SearchRank(vector, SearchQuery(code))).order_by("-rank")
```

### Property

Este decorador debe usarse para devolver variaciones de campos existentes.

```py [models.py] meta-info=val
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

Dentro de cada aplicación de django debe existir una carpeta api y dentro de ella sus respectivos archivos como: `views.py`, `serializers.py`, `urls.py`, `pagination.py`, etc.

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

Dentro de `urls.py`, DRF `router.urls` debe ser el mismo que `urlpatterns`.
Dentro del archivo `api_router.py` incluya la referencia de cada `urls.py`.

```py [urls.py] meta-info=val
from django.urls import include

urlpatterns += [
    ...
    path("", include("folder_api.app.api.urls"))
]
```

## Próximos pasos

### Celery

Django Cookiecutter ya viene con una implementación de Celery, en la que dentro de cada aplicación de Django definimos un archivo llamado `task.py` y dentro de él colocamos funciones que se ejecutarán en segundo plano con el decorador de apio `@celery_app.task`.

```py [settings.py] meta-info=val
from config.celery_app import app as celery_app

@celery_app.task
def sendEmail(user_id):
    ...
    msg = EmailMultiAlternatives(...)
    msg.send()
```

La forma más sencilla de hacer uso de estas funciones es llamando a la función y con el método `delay()` le pasamos los parámetros correspondientes.

```py [serializers.py] meta-info=val
from folder_api.users.task import sendEmail

class SignUpSerializer(serializers.Serializer):
    ...
    def create(self, validated_data):
        ...
        sendEmail.delay(user.id)
        ...
```

**Nota:** Para poder programar tareas periódicas, puedes usar el administrador de django y usar la biblioteca [django-celery-beat](https://github.com/celery/django-celery-beat){:target="\_blank"}.
