from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile',unique=True)
    role = models.CharField(max_length=10, choices=[('FARMER', 'Farmer'), ('CONSUMER', 'Consumer')], default='CONSUMER')
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, role='CONSUMER')
    else:
        # Only save the profile if it exists
        if hasattr(instance, 'profile'):
            instance.profile.save()

def create_missing_profiles():
    for user in User.objects.filter(profile__isnull=True):
        UserProfile.objects.create(user=user, role='CONSUMER')


class FarmingTip(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tips')
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='farming_tips/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Product(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', default=1)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2,  default=0.00)
    stock = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=20)
    farming_method = models.TextField(default="Not Specified")
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    consumer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    order_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed')
    ], default='PENDING')
    
    def __str__(self):
        return f"Order {self.id} - {self.consumer.username}"