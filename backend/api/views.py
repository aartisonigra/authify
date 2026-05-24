import json
import google.generativeai as genai
import PIL.Image
import decimal
import razorpay  # Razorpay લાઇબ્રેરી ઉમેરી
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from reportlab.pdfgen import canvas
from .models import Product, CartItem, Order, UserRoutine, Profile, Review

# ==============================
# AI CONFIGURATION (GEMINI)
# ==============================
genai.configure(api_key="AIzaSyAFh6dHyMroRa-AGiyPyTKJdpEhslP5uww")

# ==============================
# RAZORPAY INITIALIZATION
# ==============================
# settings.py માંથી કીઝ રીડ કરીને Razorpay ક્લાયન્ટ ચાલુ થશે
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# ==============================
# HELPER: JWT TOKENS
# ==============================
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

# ==============================
# 1. AI: SKIN SCANNER API
# ==============================
@csrf_exempt
def scan_skin(request):
    if request.method == "POST":
        try:
            image_file = request.FILES.get('image')
            if not image_file:
                return JsonResponse({"error": "No image provided"}, status=400)

            img = PIL.Image.open(image_file)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                "You are a professional dermatologist. Analyze this face image. "
                "1. Identify the skin type (Oily, Dry, Normal, or Sensitive). "
                "2. Mention one key concern you see (like redness, pores, or hydration). "
                "3. Suggest 2 ingredients that would help this skin. "
                "Keep the total response under 60 words."
            )
            response = model.generate_content([prompt, img])
            return JsonResponse({"analysis": response.text, "status": "success"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST method is allowed"}, status=405)

# ==============================
# 2. AUTH: SIGNUP & LOGIN (📌 urls.py સાથે મેચ કરવા નામ અપડેટ કર્યા)
# ==============================
@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            if User.objects.filter(username=email).exists():
                return JsonResponse({"error": "User already exists"}, status=400)
            
            user = User.objects.create_user(
                username=email, 
                email=email, 
                password=data.get("password"), 
                first_name=data.get("full_name", "")
            )
            return JsonResponse({"message": "Success", **get_tokens_for_user(user)}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = authenticate(username=data.get("email"), password=data.get("password"))
            if user:
                tokens = get_tokens_for_user(user)
                return JsonResponse({
                    "message": "Login success", 
                    "token": tokens, 
                    "full_name": user.first_name, 
                    "is_admin": user.is_staff,
                    "email": user.email
                }, status=200)
            return JsonResponse({"error": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"error": "Server error: " + str(e)}, status=500)
    return JsonResponse({"error": "Only POST allowed"}, status=405)

# ==============================
# 3. USER PROFILE & WALLET MANAGEMENT
# ==============================
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == 'GET':
        return JsonResponse({
            "full_name": request.user.first_name,
            "email": request.user.email,
            "phone": profile.phone if hasattr(profile, 'phone') else "",
            "address": profile.address if hasattr(profile, 'address') else "",
            "location": profile.location if hasattr(profile, 'location') else "Surat, Gujarat",
            "balance": str(profile.balance) if hasattr(profile, 'balance') else "0.00",
            "age": str(profile.birth_date) if hasattr(profile, 'birth_date') and profile.birth_date else "",
            "gender": profile.gender if hasattr(profile, 'gender') else "",
            "bio": profile.bio if hasattr(profile, 'bio') else "SKINCARE ENTHUSIAST"
        })
    elif request.method == 'PUT':
        data = request.data
        request.user.first_name = data.get('full_name', request.user.first_name)
        request.user.save()
        if hasattr(profile, 'phone'): profile.phone = data.get('phone', profile.phone)
        if hasattr(profile, 'address'): profile.address = data.get('address', profile.address)
        if hasattr(profile, 'location'): profile.location = data.get('location', profile.location)
        if hasattr(profile, 'bio'): profile.bio = data.get('bio', profile.bio)
        profile.save()
        return JsonResponse({"message": "Profile updated!", "status": "success"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_money(request):
    try:
        profile, _ = Profile.objects.get_or_create(user=request.user)
        amount = request.data.get('amount', 0)
        if float(amount) <= 0:
            return JsonResponse({"error": "Invalid amount"}, status=400)
            
        profile.balance += decimal.Decimal(str(amount))
        profile.save()
        return JsonResponse({"message": "Money added successfully", "balance": str(profile.balance), "status": "success"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ==============================
# 4. STORE & CART
# ==============================
def get_products(request):
    products = list(Product.objects.all().values('id', 'name', 'price', 'image_url', 'tag', 'stock'))
    return JsonResponse(products, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    try:
        product = Product.objects.get(id=request.data.get("product_id"))
        item, created = CartItem.objects.get_or_create(user=request.user, product=product)
        if not created: 
            item.quantity += 1
        item.save()
        return JsonResponse({"message": "Added to cart"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ==============================
# 5. USER ROUTINE
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_routine(request):
    try:
        data = request.data
        product_id = data.get("product_id")
        routine_type = data.get("routine_type") 

        product = Product.objects.get(id=product_id)
        routine, created = UserRoutine.objects.get_or_create(
            user=request.user, 
            product=product, 
            routine_type=routine_type
        )
        return JsonResponse({"message": "Added to routine!", "status": "success"}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ==============================
# 6. ORDER PLACE & INTEGRATION
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    try:
        data = request.data
        total_amount = float(data.get('total_amount', 0))
        payment_method = data.get('payment_method', 'cod')

        # ૧. જો યુઝરે 'Cash on Delivery' (COD) પસંદ કર્યું હોય
        if payment_method == 'cod':
            order = Order.objects.create(
                user=request.user, 
                full_name=data.get('full_name'), 
                email=data.get('email'),
                address=data.get('address'), 
                total_amount=total_amount,
                city=data.get('city', ''),
                zip_code=data.get('pincode', ''), 
                payment_method='COD'
            )
            
            # કન્ફર્મેશન ઈમેલ મોકલો
            subject = f"Order Confirmed - Dreama #{order.id}"
            message = f"Hi {order.full_name},\n\nYour order has been placed successfully using Cash on Delivery.\nTotal Amount: ₹{order.total_amount}"
            send_mail(subject, message, settings.EMAIL_HOST_USER, [order.email], fail_silently=True)
            
            return JsonResponse({"message": "Order success!", "order_id": order.id, "status": "success"}, status=201)

        # ૨. જો ઓનલાઇન પેમેન્ટ હોય
        else:
            # Razorpay પૈસામાં (Paise) કેલ્ક્યુલેટ કરે છે, તેથી અમાઉન્ટ * 100
            razorpay_amount = int(total_amount * 100)
            
            # Razorpay સર્વર પર સિક્યોર ઓર્ડર આઈડી બનાવો
            razorpay_order = razorpay_client.order.create({
                "amount": razorpay_amount,
                "currency": "INR",  # કરન્સી મોડ સેટઅપ
                "payment_capture": "1"
            })

            # ডેટાબેઝમાં ઓર્ડર ક્રિએટ કરો
            order = Order.objects.create(
                user=request.user,
                full_name=data.get('full_name'),
                email=data.get('email'),
                address=data.get('address'),
                total_amount=total_amount,
                city=data.get('city', ''),
                zip_code=data.get('pincode', ''),
                payment_method=payment_method.upper()
            )

            # ફ્રન્ટએન્ડ માટે જરૂરી ડેટા રિટર્ન કરો જેથી Razorpay નું પોપ-અપ ખુલે
            return JsonResponse({
                "online_payment": True,
                "razorpay_order_id": razorpay_order['id'],
                "razorpay_key_id": settings.RAZORPAY_KEY_ID,
                "amount": razorpay_amount,
                "order_id": order.id
            }, status=200)

    except Exception as e:
        return JsonResponse({"error": "Failed to save order: " + str(e)}, status=500)

# ==============================
# 7. RAZORPAY PAYMENT VERIFICATION
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    try:
        data = request.data
        params_dict = {
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_signature': data.get('razorpay_signature')
        }

        # આ ફંક્શન ચેક કરશે કે સિગ્નેચર અસલી છે કે ફેક
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # જો પેમેન્ટ વેલિડ હોય તો અહીં સક્સેસ રિસ્પોન્સ મોકલો
        return JsonResponse({"message": "Payment verified successfully! 🎉", "status": "success"}, status=200)
    except Exception as e:
        return JsonResponse({"error": "Payment verification failed! ❌"}, status=400)

# ==============================
# 8. HISTORY & INVOICE DOWNLOAD
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    try:
        # જો created_at ન હોય તો -id થી ઓર્ડર સોર્ટ કરો કન્ફર્મ સેફ્ટી માટે
        orders = Order.objects.filter(user=request.user).order_by('-id')
        orders_list = []
        for order in orders:
            date_str = order.created_at.strftime("%Y-%m-%d %H:%M") if hasattr(order, 'created_at') and order.created_at else "Recent"
            orders_list.append({
                "id": order.id,
                "full_name": order.full_name,
                "total_amount": float(order.total_amount),
                "payment_method": order.payment_method,
                "city": order.city,
                "created_at": date_str,
                "status": "Placed"
            })
        return JsonResponse(orders_list, safe=False)
    except Exception as e:
        return JsonResponse({"error": "History error: " + str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_invoice(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{order.id}.pdf"'
        
        p = canvas.Canvas(response)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 800, "DREAMA SKINCARE - INVOICE")
        p.setFont("Helvetica", 12)
        p.line(100, 790, 500, 790)
        p.drawString(100, 760, f"Order ID: #{order.id}")
        
        date_str = order.created_at.strftime('%Y-%m-%d') if hasattr(order, 'created_at') and order.created_at else "Recent"
        p.drawString(100, 740, f"Date: {date_str}")
        p.drawString(100, 720, f"Payment Method: {order.payment_method.upper()}")
        p.drawString(100, 680, "Customer Details:")
        p.drawString(120, 660, f"Name: {order.full_name}")
        p.drawString(120, 640, f"Email: {order.email}")
        p.drawString(120, 620, f"Address: {order.address}, {order.city} - {order.zip_code}")
        p.line(100, 600, 500, 600)
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, 570, f"TOTAL AMOUNT PAID: INR {order.total_amount}")
        p.showPage()
        p.save()
        return response
    except Exception as e:
        return JsonResponse({"error": "Invoice not found: " + str(e)}, status=404)