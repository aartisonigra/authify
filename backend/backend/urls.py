from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# મુખ્ય હોમ પેજ માટેનું ફંક્શન
def home(request):
    return HttpResponse("Hello Aarti! Django + Google Login is working ✅")

urlpatterns = [
    # એડમિન પેનલ માટે
    path('admin/', admin.site.urls),
    
    # મુખ્ય હોમ પેજ માટે
    path('', home),
    
    # ગુગલ લોગીન (django-allauth) માટે
    path('accounts/', include('allauth.urls')),
    
    # તમારી API એપના બધા રાઉટ્સ આ લાઇનથી કનેક્ટ થશે
    path('api/', include('api.urls')), 
]