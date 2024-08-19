from django.contrib import admin
from .models import Formulario

class FormularioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido_paterno', 'apellido_materno', 'area_adscripcion', 'fecha')
    search_fields = ('nombre', 'apellido_paterno', 'apellido_materno', 'area_adscripcion')
    list_filter = ('fecha', 'area_adscripcion')
    readonly_fields = ('fecha',)

admin.site.register(Formulario, FormularioAdmin)
