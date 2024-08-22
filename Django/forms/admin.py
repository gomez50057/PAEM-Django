from django.contrib import admin
from .models import Acuerdo, Actualizacion

@admin.register(Acuerdo)
class AcuerdoAdmin(admin.ModelAdmin):
    list_display = ('id_unico', 'nombre', 'estatus', 'fecha_creacion')
    search_fields = ('id_unico', 'nombre', 'apellido_paterno', 'apellido_materno')

@admin.register(Actualizacion)
class ActualizacionAdmin(admin.ModelAdmin):
    list_display = ('acuerdo', 'version', 'fecha_actualizacion', 'nombre')
    search_fields = ('acuerdo__id_unico', 'nombre', 'apellido_paterno', 'apellido_materno')
