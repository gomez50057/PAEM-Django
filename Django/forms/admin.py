from django.contrib import admin
from .models import Acuerdo, Actualizacion

@admin.register(Acuerdo)
class AcuerdoAdmin(admin.ModelAdmin):
    list_display = ('id_unico', 'comision', 'estatus', 'fecha_creacion')
    search_fields = ('id_unico', 'nombre', 'apellido_paterno', 'apellido_materno')

@admin.register(Actualizacion)
class ActualizacionAdmin(admin.ModelAdmin):
    list_display = ('acuerdo', 'estado', 'version', 'fecha_actualizacion')
    search_fields = ('acuerdo', 'estado')
    list_filter = ('acuerdo', 'estado')
