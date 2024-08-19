from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FormularioViewSet

router = DefaultRouter()
router.register(r'formularios', FormularioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
