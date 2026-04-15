from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from api import views  # 1. 'api' app mathi views import karyu

def home(request):
    return HttpResponse("Hello Aarti! Django + Google Login is working ✅")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    
    # 2. Aa line tamara 'api/urls.py' ne connect kare che
    path('api/', include('api.urls')), 
    
    path('accounts/', include('allauth.urls')),
    
    # 3. Jo tame sidhu ahiya path apva mangta ho to aavi rite lakhay
    path('api/place-order/', views.place_order, name='place_order'),
]