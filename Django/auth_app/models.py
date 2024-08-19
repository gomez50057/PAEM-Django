from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    estado = models.CharField(max_length=100)
    comision = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.user.username} - {self.estado} - {self.comision}'
