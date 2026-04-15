from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# ==============================
# 1. PRODUCT MODEL
# ==============================
class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField(default=10)
    image_url = models.URLField(max_length=500)
    tag = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

# ==============================
# 2. USER PROFILE MODEL
# ==============================
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

# --- Signals: User બને એટલે Profile પણ જાતે બની જાય ---
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()

# ==============================
# 3. USER ROUTINE MODEL
# ==============================
class UserRoutine(models.Model):
    ROUTINE_TYPES = [
        ('AM', 'Morning'),
        ('PM', 'Night'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    routine_type = models.CharField(max_length=2, choices=ROUTINE_TYPES)

    class Meta:
        unique_together = ('user', 'product', 'routine_type')

    def __str__(self):
        return f"{self.user.username}'s {self.routine_type} Routine"

# ==============================
# 4. CART ITEM MODEL
# ==============================
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

# ==============================
# 5. ORDER MODEL (Updated)
# ==============================
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # --- NEW FIELDS FOR PAYMENT & STATUS ---
    payment_method = models.CharField(max_length=50, default='cod') # cod, gpay, applepay
    payment_status = models.CharField(max_length=20, default='Pending')
    
    is_subscription = models.BooleanField(default=False)
    interval_days = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.full_name} ({self.payment_method})"

# ==============================
# 6. REVIEW & RATINGS MODEL
# ==============================
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"