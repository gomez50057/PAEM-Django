from django.urls import path
from .views import registro, inicio_sesion, current_user

urlpatterns = [
    path('registro/', registro, name='registro'),
    path('inicio-sesion/', inicio_sesion, name='inicio_sesion'),
    path('current-user/', current_user, name='current_user'),
]
