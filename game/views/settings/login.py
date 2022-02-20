from django.http import JsonResponse
from django.contrib.auth import authenticate, login

def signin(request):
    data = request.GET # 获取请求的信息
    username = data.get('username') # 用户名
    password = data.get('password') # 密码
    user = authenticate(username = username, password = password) 
    if not user: # 如果没有就直接返回不成功
        return JsonResponse({
            'result': "用户名或密码错误！"
        })
    else:
        login(request, user) # 找到了就登录
    return JsonResponse({
        'result': "success"
    })
