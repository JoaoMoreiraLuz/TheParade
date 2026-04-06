#transform informations into json format
from rest_framework import serializers
from .models import UserModel, PostModel

class UserRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):

    followersCount = serializers.SerializerMethodField()
    followingCount = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = ['username', 'email', 'first_name', 'last_name', 'bio', 'profile_image', 'followersCount', 'followingCount']

    def get_followersCount(self, obj):
        return obj.followers.count()
    
    def get_followingCount(self, obj):
        return obj.following.count()
    
class PostSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    format_created_at = serializers.SerializerMethodField()

    class Meta:
        model = PostModel
        fields = ["id", "username", "description", "created_at", "likes", "image", "likes_count", "format_created_at"]
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_format_created_at(self, obj):
        return obj.created_at.strftime("%Y-%m-%d")
    
class UserFetchSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    followersCount = serializers.SerializerMethodField()
    followingCount = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = ['username', 'email', 'first_name', 'last_name', 'bio', 'profile_image', 'followersCount', 'followingCount']

    def get_profile_image(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                # Adiciona /api antes de /media
                return request.build_absolute_uri(f"/api{obj.profile_image.url}")
            return f"/api{obj.profile_image.url}"
        return None

    def get_followersCount(self, obj):
        return obj.followers.count()  # Total de pessoas que seguem este usuário

    def get_followingCount(self, obj):
        return obj.following.count()  # Total de pessoas que este usuário segue