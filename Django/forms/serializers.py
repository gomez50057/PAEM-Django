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
