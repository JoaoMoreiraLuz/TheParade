from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework.pagination import PageNumberPagination

from .models import PostModel, UserModel
from .serializers import UserRegisterSerializer, UserFetchSerializer, UserSerializer, PostSerializer

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def isAuthenticated(request):
    try:
        user = request.user
        serializer = UserSerializer(user, many=False)

        # Garante que a URL da imagem seja completa
        profile_image_url = serializer.data.get('profile_image')
        if profile_image_url and not profile_image_url.startswith("http"):
            profile_image_url = request.build_absolute_uri(profile_image_url)

        response_data = {
            **serializer.data,
            "profile_image": profile_image_url,
            "isAuthenticated": True
        }
        return Response(response_data)
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"})

@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens["access"]
            refresh_token = tokens["refresh"]
            username = request.data.get('username')

            if not username:
                return Response({"error": "Username not provided"}, status=400)

            try:
                user = UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                return Response({"error": "User not found"}, status=404)

            serializer = UserFetchSerializer(user, context={'request': request})
            res = Response()

            res.data = {
                "success": True,
                "isAuthenticated": True,
                "user": serializer.data
            }

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
                path="/"
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="None",
                path="/"
            )
            return res
        except Exception as e:
            return Response({"success": False, "error": str(e)})
        
class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
                
            refresh_token = request.COOKIES.get("refresh_token")
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']

            res = Response({
                "access": access_token
            })

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                path="/"
                )
            
            return res
        except Exception as e:
            return Response({"error": str(e)}, status=401)

        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request, primary_key):
    try:
        user = UserModel.objects.get(username=primary_key)
        serializer = UserFetchSerializer(user, context={'request': request})

        following = request.user in user.followers.all()

        return Response({
            "isAuthenticated": True,
            "user": serializer.data,
            "LoggedAs": request.user.username == user.username,
            "Following": following
        })
    except UserModel.DoesNotExist:
        return Response({"error": "User not found"})
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleFollow(request):
    try:
        try:
            myUser = UserModel.objects.get(username=request.user.username)
            userToFollow = UserModel.objects.get(username=request.data['username'])
        except UserModel.DoesNotExist:
            return Response({"error": "User not found"})
        
        if myUser in userToFollow.followers.all():
            userToFollow.followers.remove(myUser)
            return Response({"isFollowing": False})
        else :
            userToFollow.followers.add(myUser)
            return Response({"isFollowing": True})
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPosts(request, primary_key):
    try:
        user = UserModel.objects.get(username=primary_key)
        loggedUser = UserModel.objects.get(username=request.user.username)
    except UserModel.DoesNotExist:
        return Response({"error": "User not found"})
    
    posts = user.posts.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)

    data = []

    for post in serializer.data:
        new_post = {}

        if loggedUser.username in post['likes']:
            new_post = {**post, "liked": True}
        else:
            new_post = {**post, "liked": False}
        data.append(new_post)

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggleLike(request):
    try:
        try:
            post = PostModel.objects.get(id=request.data['post_id'])
        except PostModel.DoesNotExist:
            return Response({"error": "Post not found"})
        
        try:
            user = UserModel.objects.get(username=request.user.username)
        except Exception as e:
            return Response({"error": "User not found"})
        
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"liked": False})
        else:
            post.likes.add(user)
            return Response({"liked": True})
    except Exception as e:
        return Response({"error": "failed to like the post"}) 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createPost(request):
    
    try:
        data = request.data

        try:
            user = UserModel.objects.get(username=request.user.username)
        except UserModel.DoesNotExist:
            return Response({"error": "User not found"})
        
        post = PostModel.objects.create(
            user=user,
            description=data.get('description', ''),
            image=data.get('image', None)
        )

        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": "An error occurred while creating the post: " + str(e)})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFeed(request):

    try:
        loggedUser = UserModel.objects.get(username=request.user.username)
    except UserModel.DoesNotExist:
        return Response({"error": "User not found"})
    
    posts = PostModel.objects.all().order_by('-created_at')

    paginator = PageNumberPagination()
    paginator.page_size = 10

    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)

    data = []

    for post in serializer.data:
        new_post = {}

        if loggedUser.username in post['likes']:
            new_post = {**post, "liked": True}
        else:
            new_post = {**post, "liked": False}
        data.append(new_post)

    return paginator.get_paginated_response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def searchUsers(request):
    query = request.query_params.get('query', '')
    user = UserModel.objects.filter(username__icontains=query)
    serializer = UserFetchSerializer(user, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UpdateUserDetails(request):
    user = request.user

    data = request.data
    user.username = data.get("username", user.username)
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    user.bio = data.get("bio", user.bio)

    if "profile_image" in request.FILES:
        user.profile_image = request.FILES["profile_image"]

    user.save()

    serializer = UserFetchSerializer(user, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response()
        res.data = {"success":True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    
    except:
        return Response({"success":False})
    
