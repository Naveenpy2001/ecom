from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Products(models.Model):
    CATEGORY_CHOICES = [
        ('electronics' , 'ELECTRONICS'),
        ('fashion','FASHION'),
        ('home','Home & Kitchen')
    ]
    name=models.CharField(max_length=225)
    description = models.TextField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    is_published = models.BooleanField(default=False)
    category = models.CharField(max_length=100,choices=CATEGORY_CHOICES,default='electronics')
    images = models.ImageField(upload_to='product_images/',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    units = models.IntegerField(default=0)

    def is_available(self):
        return self.units > 0  # Check stock availability
    
    def buy_product(self,quantity):
        if self.units >= quantity:
            self.units -= quantity
            self.save()
            return True
        return False

    def __str__(self):
        return f"{self.name} - {'Available' if self.is_available() else 'Out of Stock'}"
    

class UserRegister(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=225,blank=True,null=True,unique=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

from django.utils import timezone

class Order(models.Model):
    user = models.ForeignKey(UserRegister,on_delete=models.CASCADE)
    product = models.ForeignKey(Products,on_delete=models.CASCADE)
    quantity = models.PositiveBigIntegerField()
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.email} - {self.product.name} ({self.quantity})'

