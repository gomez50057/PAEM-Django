from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcuerdoViewSet, ActualizacionViewSet, AcuerdoCargaMasivaViewSet

router = DefaultRouter()
router.register(r'acuerdos', AcuerdoViewSet)
router.register(r'actualizaciones', ActualizacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('carga-masiva/', AcuerdoCargaMasivaViewSet.as_view({'post': 'create'})),
]
