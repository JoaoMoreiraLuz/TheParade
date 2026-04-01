from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import UserModel
from .serializers import UserRegisterSerializer, UserSerializer

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def isAuthenticated(request):
    user = request.user
    return Response({
        "username": user.username,
        "isAuthenticated": True
    })

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

            res = Response()

            # Extrair username do request
            username = request.data.get('username')

            res.data = {"success": True, "username": username}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                path="/"
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite="Lax",
                path="/"
            )
            return res
        except:
            return Response({"success": False})
        
class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
                
            refresh_token = request.COOKIES.get("refresh_token")
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']

            res = Response()

            res.set_cookie(
                    key="access_token",
                    value=access_token,
                    httponly=True,
                    secure=False,
                    samesite="Lax",
                    path="/"
                )
            
            return res
        except:
            return Response({"success": False})

        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request, primary_key):
    try:
        try:
            user = UserModel.objects.get(username=primary_key)
        except UserModel.DoesNotExist:
            return Response({"error": "User not found"})
        
        serializer = UserSerializer(user, many=False)

        following = False

        if request.user in user.followers.all():
            following = True

        response_data = {
            **serializer.data,
            "LoggedAs": request.user.username == user.username,
            "Following": following
        }
        return Response(response_data)
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
