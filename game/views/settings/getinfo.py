from platform import platform
from django.http import JsonResponse
from game.models.player.player import Player

def getinfo_acapp(request):
    player = Player.objects.all()[0] # Player.objects是一个数组，代表Player数据表的所有元素的数组，这里为了测试就直接返回第一个人的信息，后面再实现找出这个用户
    return JsonResponse({ # 返回Json
        'result': "success",
        'username': player.user.username, # 用户名
        'photo': player.photo, # 头像URL
    })

def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录",
        })
    else:
        player = Player.objects.all()[0] # Player.objects是一个数组，代表Player数据表的所有元素的数组，这里为了测试就直接返回第一个人的信息，后面再实现找出这个用户
        return JsonResponse({ # 返回Json
            'result': "success",
            'username': player.user.username, # 用户名
            'photo': player.photo, # 头像URL
    })

def getinfo(request):
    platform = request.GET.get('platform')
    if platform == "ACAPP":
        return getinfo_acapp(request)
    elif platform == "WEB":
        return getinfo_web(request)
