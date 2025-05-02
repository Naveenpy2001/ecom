from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()

router.register(r'products',ProductView,basename='products')
router.register(r'orders',OrderViewset,basename='orders')

urlpatterns = [
    path('',include(router.urls)),
    path("register/",RegisterView.as_view(),name='register'),
    path('login/',LoginView.as_view(),name='login'),
] 