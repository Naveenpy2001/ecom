from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

class ProductSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()
    class Meta:
        model = Products
        fields = '__all__'

    def get_is_available(self,obj):
        return obj.is_available()
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegister
        fields = ['id','email','username']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,min_length=4) #min_length mean's minimum 12 char required..!
    class Meta:
        model = UserRegister
        fields = ['id','email','username','password']

    def create(self, validated_data):
        user = UserRegister.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data.get('username','')
        )
        return user

class LoginSerailizer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user  = UserRegister.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return {
                'refresh' : str(refresh),
                'access' : str(refresh.access_token),
                'user' : UserSerializer(user).data
            }
        raise serializers.ValidationError('invalid email or password')
    


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.FloatField(source="product.price", read_only=True)
    order_time = serializers.DateTimeField(source="created_at", format="%Y-%m-%d %H:%M:%S", read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'total_price', 'created_at','order_time']
        read_only_fields = ['user', 'total_price', 'created_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        quantity = validated_data['quantity']

        if product.units < quantity:
            raise serializers.ValidationError('Not enough Stock Available')
        
        
        product.buy_product(quantity)

        order = Order.objects.create(
            user = user,
            product = product,
            quantity = quantity,
            total_price = product.price * quantity
        )

        return order
    


