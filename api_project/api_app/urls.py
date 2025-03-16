from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import*

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'tips', views.FarmingTipViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('payment/<int:order_id>/', views.process_payment, name='process_payment'),
    path('user/', views.UserDetailView.as_view(), name='user-detail'),
    path('api/tips/<int:tip_id>/', delete_farming_tip, name='delete-tip'),
     path('api/current-user/', current_user, name='current-user'),


]