from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello Aarti! Django + Google Login is working ?")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    
    # ? ???? ?????? api/urls.py ?? ?????? ??? ??
    path('api/', include('api.urls')), 
    path('accounts/', include('allauth.urls')),
]
