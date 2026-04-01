#transform informations into json format
from rest_framework import serializers
from .models import UserModel

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
        fields = ["username", "bio", "profile_image", "followersCount", "followingCount"]

    def get_followersCount(self, obj):
        return obj.followers.count()
    
    def get_followingCount(self, obj):
        return obj.following.count()