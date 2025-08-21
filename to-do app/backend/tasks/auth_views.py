from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user and return JWT tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create new user
    try:
        user = User.objects.create(
            username=username,
            password=make_password(password)
        )
        
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': 'Failed to create user'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)