from django.db import models
import datetime
import os

# Funciones para generar las rutas de subida de archivos
def upload_to_documentos(instance, filename):
    if not instance.id_unico:
        instance.save()
    return os.path.join('acuerdos', instance.id_unico, 'original', 'documentos', filename)

def upload_to_minuta(instance, filename):
    if not instance.id_unico:
        instance.save()
    return os.path.join('acuerdos', instance.id_unico, 'original', 'minuta', filename)

def upload_to_actualizacion_documentos(instance, filename):
    acuerdo_id = instance.acuerdo.id_unico
    version = instance.version if instance.version else instance.acuerdo.actualizaciones.count() + 1
    return os.path.join('acuerdos', acuerdo_id, f'version_{version}', 'documentos', filename)

def upload_to_actualizacion_minuta(instance, filename):
    acuerdo_id = instance.acuerdo.id_unico
    version = instance.version if instance.version else instance.acuerdo.actualizaciones.count() + 1
    return os.path.join('acuerdos', acuerdo_id, f'version_{version}', 'minuta', filename)

# Modelo de Acuerdo
class Acuerdo(models.Model):
    ESTATUS_CHOICES = [
        ('en_proceso', 'En Proceso'),
        ('sin_avance', 'Sin Avance'),
        ('atendido', 'Atendido'),
        ('cancelado', 'Cancelado')
    ]

    ZM_CHOICES = [
        ('ZMVM', 'Valle de México'),
        ('ZMPachuca', 'Pachuca'),
        ('ZMTulancingo', 'Tulancingo'),
        ('ZMTula', 'Tula'),
        ('no_aplica', 'No Aplica')
    ]
    
    comision = models.CharField(max_length=100, blank=True, null=True)

    id_unico = models.CharField(max_length=255, unique=True, editable=False)
    fecha_creacion = models.DateField(null=True, blank=True)
    estatus = models.CharField(max_length=50, choices=ESTATUS_CHOICES, default='en_proceso')

    zm = models.CharField(max_length=50, choices=ZM_CHOICES)
    descripcion_acuerdo = models.TextField(max_length=5000)

    # Archivos globales para el acuerdo
    documentos = models.FileField(upload_to=upload_to_documentos, blank=True, null=True)
    minuta = models.FileField(upload_to=upload_to_minuta, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.id_unico:
            current_year = datetime.date.today().year
            commission_siglas = self.comision if self.comision else "SC"  # Siglas de comisión si existe

            # Contar el total de acuerdos para ese año y generar el id_unico
            total_acuerdos = Acuerdo.objects.filter(fecha_creacion__year=current_year).count() + 1

            potential_id_unico = f"AC{current_year}-{commission_siglas}-{total_acuerdos:03d}"
            while Acuerdo.objects.filter(id_unico=potential_id_unico).exists():
                total_acuerdos += 1
                potential_id_unico = f"AC{current_year}-{commission_siglas}-{total_acuerdos:03d}"

            self.id_unico = potential_id_unico

        super(Acuerdo, self).save(*args, **kwargs)

    def __str__(self):
        return f"Acuerdo {self.id_unico}"

# Modelo de Actualización
class Actualizacion(models.Model):
    ENTIDAD_CHOICES = [
        ('CDMX', 'Ciudad de México'),
        ('EdoMex', 'Estado de México'),
        ('Hidalgo', 'Hidalgo')
    ]

    acuerdo = models.ForeignKey(Acuerdo, on_delete=models.CASCADE, related_name='actualizaciones')
    estado = models.CharField(max_length=50, choices=ENTIDAD_CHOICES)

    fecha_actualizacion = models.DateField(auto_now_add=True)
    descripcion_avance = models.TextField(max_length=5000)
    documentos = models.FileField(upload_to=upload_to_actualizacion_documentos, blank=True, null=True)
    minuta = models.FileField(upload_to=upload_to_actualizacion_minuta, blank=True, null=True)
    version = models.IntegerField(editable=False)

    # Datos duplicados del acuerdo para cada versión
    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    cargo = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    extension = models.CharField(max_length=10, blank=True, null=True)
    correo = models.EmailField()

    def save(self, *args, **kwargs):
        # Asignar estado y comisión automáticamente del acuerdo original
        if self.acuerdo:
            self.comision = self.acuerdo.comision

        if not self.version:
            # Asignar la versión basándose en las actualizaciones existentes para esa estado
            self.version = Actualizacion.objects.filter(acuerdo=self.acuerdo, estado=self.estado).count() + 1

        super(Actualizacion, self).save(*args, **kwargs)

    def __str__(self):
        return f'Actualización {self.version} para Acuerdo {self.acuerdo.id_unico} - Entidad: {self.estado}'
