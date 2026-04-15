from django.urls import path
from . import views 

urlpatterns = [
    # ==============================
    # 1. AUTHENTICATION
    # ==============================
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    
    # ==============================
    # 2. PRODUCTS & STORE
    # ==============================
    path('products/', views.get_products, name='get_products'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('routine/', views.add_to_routine, name='add_to_routine'), # ખાતરી કરો કે views માં આ ફંક્શન છે
    
    # ==============================
    # 3. USER PROFILE & HISTORY (NEW)
    # ==============================
    path('profile/', views.profile_view, name='profile_view'),
    path('order-history/', views.order_history, name='order_history'),
    
    # ==============================
    # 4. ORDERS & INVOICE
    # ==============================
    path('place-order/', views.place_order, name='place_order'), 
    path('download-invoice/<int:order_id>/', views.download_invoice, name='download_invoice'),

    # ==============================
    # 5. AI FEATURES
    # ==============================
    path('scan-skin/', views.scan_skin, name='scan_skin'),
]