from rest_framework import serializers
from .models import Acuerdo, Actualizacion

class AcuerdoSerializer(serializers.ModelSerializer):
    actualizaciones = serializers.StringRelatedField(many=True, read_only=True)  # Esto es opcional, para mostrar las actualizaciones relacionadas

    class Meta:
        model = Acuerdo
        fields = '__all__'

class ActualizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actualizacion
        fields = '__all__'


class AcuerdoCargaMasivaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Acuerdo
        fields = '__all__'

    documentos = serializers.CharField(required=False, allow_null=True)
    minuta = serializers.CharField(required=False, allow_null=True)

    # Validamos que las URLs proporcionadas sean válidas
    def validate_documentos(self, value):
        if value and not value.startswith('/acuerdos/'):
            raise serializers.ValidationError("El valor de 'documentos' debe ser una URL válida en el directorio /acuerdos/.")
        return value

    def validate_minuta(self, value):
        if value and not value.startswith('/acuerdos/'):
            raise serializers.ValidationError("El valor de 'minuta' debe ser una URL válida en el directorio /acuerdos/.")
        return value