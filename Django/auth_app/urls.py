from django.urls import path
from .views import registro, inicio_sesion

urlpatterns = [
    path('registro/', registro, name='registro'),
    path('inicio-sesion/', inicio_sesion, name='inicio_sesion'),
]
