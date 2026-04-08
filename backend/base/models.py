from django.db import models
from django.contrib.auth.models import AbstractUser
 
class UserModel(AbstractUser):
    username = models.CharField(max_length=50, unique=True, primary_key=True)
    bio = models.TextField(blank=True, max_length=500)
    profile_image = models.URLField(blank=True, null=True)
 
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
 
    def __str__(self):
        return self.username
    
class PostModel(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='posts')
    description = models.TextField(blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(UserModel, related_name='liked_posts', blank=True)
    image = models.URLField(blank=True, null=True)