from django.http import HttpResponse

def index(request):
    title='<h1 style="text-align: center">My first web.</h1>'
    return HttpResponse(title)

