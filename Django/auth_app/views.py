from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def registro(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        group_name = data.get('group')  # 'responsable' o 'enlace'

        if not all([username, password, group_name]):
            return JsonResponse({'status': 'error', 'message': 'Faltan campos obligatorios'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'El usuario ya existe'}, status=400)

        user = User.objects.create_user(username=username, password=password)
        
        try:
            group = Group.objects.get(name=group_name)
        except Group.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Grupo no válido'}, status=400)

        user.groups.add(group)
        return JsonResponse({'status': 'ok', 'message': 'Usuario registrado exitosamente'})

    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def inicio_sesion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            group = user.groups.first().name if user.groups.exists() else 'sin grupo'
            return JsonResponse({'status': 'ok', 'group': group})
        else:
            return JsonResponse({'status': 'error', 'message': 'Credenciales inválidas'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)
