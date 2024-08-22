from django.db import models
import datetime

class Acuerdo(models.Model):
    ESTATUS_CHOICES = [
        ('en_proceso', 'En Proceso'),
        ('sin_avance', 'Sin Avance'),
        ('atendido', 'Atendido'),
        ('cancelado', 'Cancelado')
    ]

    id_unico = models.CharField(max_length=255, unique=True, editable=False)
    fecha_creacion = models.DateField(auto_now_add=True)
    estatus = models.CharField(max_length=50, choices=ESTATUS_CHOICES, default='en_proceso')
    acuerdo_original = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='versiones')
    
    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    area_adscripcion = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    extension = models.CharField(max_length=10, blank=True, null=True)
    correo = models.EmailField()
    descripcion_acuerdo = models.TextField(max_length=5000)
    descripcion_avance = models.TextField(max_length=5000, blank=True, null=True)
    documentos = models.FileField(upload_to='documentos/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.id_unico:
            current_year = datetime.date.today().year
            commission_siglas = "SC"  # Aquí deberías obtener dinámicamente las siglas de la comisión
            total_acuerdos = Acuerdo.objects.filter(fecha_creacion__year=current_year).count() + 1

            self.id_unico = f"AC{current_year}-{commission_siglas}-{total_acuerdos:03d}"
        
        super(Acuerdo, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.id_unico} - {self.nombre} {self.apellido_paterno}'

class Actualizacion(models.Model):
    acuerdo = models.ForeignKey(Acuerdo, on_delete=models.CASCADE, related_name='actualizaciones')
    fecha_actualizacion = models.DateField(auto_now_add=True)
    descripcion_avance = models.TextField(max_length=5000)
    documentos = models.FileField(upload_to='documentos/', blank=True, null=True)
    version = models.IntegerField(editable=False)  # Marcamos como no editable

    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    area_adscripcion = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    extension = models.CharField(max_length=10, blank=True, null=True)
    correo = models.EmailField()

    def save(self, *args, **kwargs):
        if not self.version:
            # Calculamos la versión en función del número de actualizaciones existentes para este acuerdo
            self.version = self.acuerdo.actualizaciones.count() + 1
        
        super(Actualizacion, self).save(*args, **kwargs)

    def __str__(self):
        return f'Actualización {self.version} para Acuerdo {self.acuerdo.id_unico} - {self.descripcion_avance}'
