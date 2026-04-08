from rest_framework import serializers
from .models import UserModel, PostModel, CommentModel

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

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    format_created_at = serializers.SerializerMethodField()

    class Meta:
        model = CommentModel
        fields = ["id", "username", "profile_image", "text", "format_created_at"]

    def get_username(self, obj):
        return obj.user.username

    def get_profile_image(self, obj):
        return obj.user.profile_image or None

    def get_format_created_at(self, obj):
        return obj.created_at.strftime("%Y-%m-%d")

class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    format_created_at = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = PostModel
        fields = ["id", "username", "description", "created_at", "likes", "image", "likes_count", "format_created_at", "comments_count"]
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_format_created_at(self, obj):
        return obj.created_at.strftime("%Y-%m-%d")

    def get_comments_count(self, obj):
        return obj.comments.count()

class UserFetchSerializer(serializers.ModelSerializer):
    followersCount = serializers.SerializerMethodField()
    followingCount = serializers.SerializerMethodField()

    class Meta:
        model = UserModel
        fields = ['username', 'email', 'first_name', 'last_name', 'bio', 'profile_image', 'followersCount', 'followingCount']

    def get_followersCount(self, obj):
        return obj.followers.count()

    def get_followingCount(self, obj):
        return obj.following.count()