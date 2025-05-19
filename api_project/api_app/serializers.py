from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Product, FarmingTip, Order

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')
        
    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        #UserProfile.objects.create(user=user, role=role)
        user.profile.role = role
        user.profile.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'role')

class FarmingTipSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    farmer_id = serializers.ReadOnlyField(source='farmer.id')
    
    class Meta:
        model = FarmingTip
        fields = ('id', 'title', 'content', 'farmer_name', 'created_at','image','farmer_id')
        read_only_fields = ('farmer_name', 'created_at')

class ProductSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'stock','unit', 'farming_method', 'farmer_name', 'created_at','image')
        read_only_fields = ('farmer_name', 'created_at')

class OrderSerializer(serializers.ModelSerializer):
    consumer_name = serializers.CharField(source='consumer.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'consumer_name', 'product', 'product_name', 'quantity', 'total_price', 'order_date', 'payment_status')
        read_only_fields = ('consumer_name', 'product_name', 'order_date', 'total_price')
    
    def create(self, validated_data):
        product = validated_data.get('product')
        quantity = validated_data.get('quantity')
        
        if product.stock < quantity:
            raise serializers.ValidationError({"error": "Not enough stock available"})
        
        total_price = product.price * quantity
        validated_data['total_price'] = total_price
        
        product.stock -= quantity
        product.save()
        
        return super().create(validated_data)