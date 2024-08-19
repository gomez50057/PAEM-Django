from django.db import models

class Formulario(models.Model):
    fecha = models.DateField(auto_now_add=True)
    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    area_adscripcion = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    extension = models.CharField(max_length=10, blank=True, null=True)
    correo = models.EmailField()
    descripcion_acuerdo = models.TextField(max_length=5000)  # Campo actualizado
    descripcion_avance = models.TextField(max_length=5000)
    documentos = models.FileField(upload_to='documentos/', blank=True, null=True)

    def __str__(self):
        return f'{self.nombre} {self.apellido_paterno} - {self.descripcion_acuerdo}'
