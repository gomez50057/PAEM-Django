from rest_framework import viewsets
from .models import Formulario
from .serializers import FormularioSerializer

class FormularioViewSet(viewsets.ModelViewSet):
    queryset = Formulario.objects.all()
    serializer_class = FormularioSerializer

