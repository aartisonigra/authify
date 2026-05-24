from django.urls import path
# ખાતરી કરો કે તમારા views ના બધા જ ફંક્શનના નામ અહીં સાચા લખેલા છે
from api.views import profile_view, add_money, place_order, verify_payment, signup_view, login_view 

urlpatterns = [
    # 🔐 લોગિન અને સાઇનઅપ
    path('signup/', signup_view, name='signup_view'),
    path('login/', login_view, name='login_view'),

    # 🛒 ઓર્ડર અને પ્રોફાઇલ
    path('place-order/', place_order, name='place_order'),
    path('profile/', profile_view, name='profile_view'), 
    path('add-money/', add_money, name='add_money'),     
    path('verify-payment/', verify_payment, name='verify_payment'),
]