from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcuerdoViewSet, ActualizacionViewSet

router = DefaultRouter()
router.register(r'acuerdos', AcuerdoViewSet)
router.register(r'actualizaciones', ActualizacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
