from rest_framework import viewsets
from .models import Acuerdo, Actualizacion
from .serializers import AcuerdoSerializer, ActualizacionSerializer

class AcuerdoViewSet(viewsets.ModelViewSet):
    queryset = Acuerdo.objects.all()
    serializer_class = AcuerdoSerializer

class ActualizacionViewSet(viewsets.ModelViewSet):
    queryset = Actualizacion.objects.all()
    serializer_class = ActualizacionSerializer
