from rest_framework import viewsets,status,generics,permissions
from .models import Products,UserRegister
from .serializers import *
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter,OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

class RegisterView(generics.CreateAPIView):
    queryset = UserRegister.objects.all()
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerailizer

    def post(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data,status=status.HTTP_200_OK)


class ProductView(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter,DjangoFilterBackend,OrderingFilter]
    search_fields = ['name','description','category']
    ordering_fields = ['price','name', 'category']
    ordering = ['price']
    filterset_fields = ['category','price']

    @action(detail=True,methods=['post','get'])
    def publish(self,request,pk=None):
        product = self.get_object()  #get the specific product
        product.is_published = not product.is_published
        product.save()
        return Response({'message':'updated','is_published':product.is_published})
    
    @action(detail=False,methods=['post','get'])
    def bulk_delete(self,request):
        product_ids = request.data.get('ids',[]) #get IDs from request
        delete_count, _ = Products.objects.filter(id__in = product_ids).delete()
        return Response({'message':f'Deleted {delete_count} products'},status=status.HTTP_200_OK)
    
    @action(detail=False,methods=['get'],url_path='published')
    def published_items(self,request):
        published_items = self.get_queryset().filter(is_published=True)
        published = self.get_serializer(published_items,many=True)
        return Response(published.data,status=status.HTTP_200_OK)


class OrderViewset(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    


