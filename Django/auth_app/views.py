from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
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

            # Obtenemos el perfil del usuario
            profile = user.userprofile  # Asegúrate de que el perfil siempre existe

            return JsonResponse({
                'status': 'ok',
                'group': group,
                'username': user.username,
                'estado': profile.estado,
                'comision': profile.comision
            })
        else:
            return JsonResponse({'status': 'error', 'message': 'Credenciales inválidas'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@login_required
def current_user(request):
    user = request.user
    try:
        profile = user.userprofile
        user_data = {
            'username': user.username,
            'groups': list(user.groups.values_list('name', flat=True)),
            'estado': profile.estado,
            'comision': profile.comision,
        }
    except UserProfile.DoesNotExist:
        user_data = {
            'username': user.username,
            'groups': list(user.groups.values_list('name', flat=True)),
            'estado': None,
            'comision': None,
        }
    return JsonResponse(user_data)
