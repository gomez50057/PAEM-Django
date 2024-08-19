from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'estado', 'comision')
    search_fields = ('user__username', 'estado', 'comision')
