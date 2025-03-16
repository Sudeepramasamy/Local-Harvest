from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from .models import UserProfile, Product, FarmingTip, Order
from .serializers import UserSerializer, UserProfileSerializer, ProductSerializer, FarmingTipSerializer, OrderSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required



@login_required
def current_user(request):
    return JsonResponse({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email
    })

class IsFarmer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not hasattr(request.user, 'profile'):
            return False  # Reject users without a profile
        return request.user.profile.role == 'FARMER'

class IsConsumer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not hasattr(request.user, 'profile'):
            return False  # Reject users without a profile
        return request.user.profile.role == 'CONSUMER'

class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user, defaults={'role': 'CONSUMER'})
        return profile

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:  # Admins can see all users
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        else:  # Regular users see only their own data
            return Response({
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            })

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.farmer == request.user

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsFarmer()]
        return []
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

class FarmingTipViewSet(viewsets.ModelViewSet):
    queryset = FarmingTip.objects.all()
    serializer_class = FarmingTipSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsFarmer()]
        return []
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsConsumer()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Order.objects.none()  
        if user.profile.role == 'CONSUMER':
            return Order.objects.filter(consumer=user)
        elif user.profile.role == 'FARMER':
            return Order.objects.filter(product__farmer=user)
        return Order.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(consumer=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsConsumer])
def process_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id, consumer=request.user)
        
        # Simple payment simulation
        order.payment_status = 'COMPLETED'
        order.save()
        
        return Response({"message": "Payment processed successfully"}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_farming_tip(request, tip_id):
    try:
        tip = FarmingTip.objects.get(id=tip_id)

        # Check if the logged-in user is the owner of the tip
        if request.user.id != tip.farmer.id:
            return Response({'error': 'You are not authorized to delete this tip'}, status=status.HTTP_403_FORBIDDEN)

        tip.delete()
        return Response({'message': 'Tip deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    except FarmingTip.DoesNotExist:
        return Response({'error': 'Tip not found'}, status=status.HTTP_404_NOT_FOUND)