from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from tasks.auth_views import register_user

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT endpoints
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', register_user, name='user_register'),
    # tasks app
    path('api/', include('tasks.urls'))
]

