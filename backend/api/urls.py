from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
# અહીં આપણે સ્પેસિફિક ફંક્શન્સ જ ડાયરેક્ટ ઈમ્પોર્ટ કરીએ છીએ, જેથી મોડ્યુલ કન્ફ્યુઝન જ ન થાય
from api.views import profile_view, add_money, place_order 

def home(request):
    return HttpResponse("Hello Aarti! Django + Google Login is working ✅")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    
    # એપ લેવલના રાઉટ્સ
    path('api/', include('api.urls')), 
    path('accounts/', include('allauth.urls')),
    
    # અહીં ડાયરેક્ટ ફંક્શન પાસ કર્યા
    path('api/place-order/', place_order, name='place_order'),
    path('api/profile/', profile_view, name='profile_view'), 
    path('api/add-money/', add_money, name='add_money'),     
]