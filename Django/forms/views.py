from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import Acuerdo, Actualizacion
from .serializers import AcuerdoSerializer, ActualizacionSerializer, AcuerdoCargaMasivaSerializer

class AcuerdoViewSet(viewsets.ModelViewSet):
    queryset = Acuerdo.objects.all()
    serializer_class = AcuerdoSerializer

class ActualizacionViewSet(viewsets.ModelViewSet):
    queryset = Actualizacion.objects.all()
    serializer_class = ActualizacionSerializer

class AcuerdoCargaMasivaViewSet(viewsets.ViewSet):
    def create(self, request):
        if isinstance(request.data, list):
            # Si es una lista, procesamos cada uno de los elementos
            serializer = AcuerdoCargaMasivaSerializer(data=request.data, many=True)
        else:
            # Si es un diccionario, lo procesamos normalmente
            serializer = AcuerdoCargaMasivaSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

