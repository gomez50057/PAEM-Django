from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserProfile  # Asegúrate de importar el modelo

@csrf_exempt
def registro(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Si el objeto no es una lista, lo convertimos en una lista con un solo elemento
        if not isinstance(data, list):
            data = [data]

        results = []
        for user_data in data:
            username = user_data.get('username')
            password = user_data.get('password')
            group_name = user_data.get('group')
            estado = user_data.get('estado')
            comision = user_data.get('comision')

            if not all([username, password, group_name, estado, comision]):
                results.append({'username': username, 'status': 'error', 'message': 'Faltan campos obligatorios'})
                continue

            if User.objects.filter(username=username).exists():
                results.append({'username': username, 'status': 'error', 'message': 'El usuario ya existe'})
                continue

            user = User.objects.create_user(username=username, password=password)
            UserProfile.objects.create(user=user, estado=estado, comision=comision)

            try:
                group = Group.objects.get(name=group_name)
            except Group.DoesNotExist:
                results.append({'username': username, 'status': 'error', 'message': 'Grupo no válido'})
                continue

            user.groups.add(group)
            
            # Aquí podrías guardar `estado` y `comision` en un perfil de usuario si es necesario
            # Por ejemplo, si tienes un modelo de perfil relacionado con el usuario:
            # UserProfile.objects.create(user=user, estado=estado, comision=comision)

            results.append({'username': username, 'status': 'ok', 'message': 'Usuario registrado exitosamente'})

        return JsonResponse({'status': 'finalizado', 'results': results})

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
