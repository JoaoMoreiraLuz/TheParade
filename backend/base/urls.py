# Adicione estas duas rotas no seu urls.py, junto com as existentes:
#
# from .views import getFollowers, getFollowing
#
# urlpatterns = [
#     ...suas rotas existentes...
#     path('followers/<str:username>/', getFollowers),
#     path('following/<str:username>/', getFollowing),
# ]
#
# Exemplo completo de como deve ficar o urls.py:

from django.urls import path
from .views import (
    registerUser,
    isAuthenticated,
    CustomTokenObtainPairView,
    CustomRefreshTokenView,
    getUser,
    toggleFollow,
    getFollowers,
    getFollowing,
    getPosts,
    toggleLike,
    createPost,
    getFeed,
    searchUsers,
    UpdateUserDetails,
    logout,
    getComments,
    createComment,
)

urlpatterns = [
    path('register/', registerUser),
    path('isauthenticated/', isAuthenticated),
    path('token/', CustomTokenObtainPairView.as_view()),
    path('token/refresh/', CustomRefreshTokenView.as_view()),
    path('user/<str:primary_key>/', getUser),
    path('toggle-follow/', toggleFollow),
    path('followers/<str:username>/', getFollowers),   
    path('following/<str:username>/', getFollowing),   
    path('posts/<str:primary_key>/', getPosts),
    path('toggle-like/', toggleLike),
    path('create-post/', createPost),
    path('feed/', getFeed),
    path('search/', searchUsers),
    path('update_user/', UpdateUserDetails),
    path('logout/', logout),
    path('posts/<int:post_id>/comments/', getComments),
    path('posts/<int:post_id>/comments/create/', createComment),
]