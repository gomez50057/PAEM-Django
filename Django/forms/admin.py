from django.contrib import admin
from .models import Acuerdo, Actualizacion  # Actualiza esta línea con los nuevos modelos

# Registra los modelos en el admin
admin.site.register(Acuerdo)
admin.site.register(Actualizacion)

