from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views import CustomTokenObtainPairView, getUser, CustomRefreshTokenView, registerUser, isAuthenticated, toggleFollow
urlpatterns = [
    path('user/<str:primary_key>/', getUser),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('register/', registerUser),
    path('isauthenticated/', isAuthenticated),
    path('toggle-follow/', toggleFollow)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
