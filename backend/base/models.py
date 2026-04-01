from django.db import models
from django.contrib.auth.models import AbstractUser

class UserModel(AbstractUser):
    username = models.CharField(max_length=50, unique=True, primary_key=True)
    bio = models.TextField(blank=True, max_length=500)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)

    #testing
    #if profile_image is None:
        #profile_image = "profile_images/default_profile_image.png"
   #else:
       #profile_image = profile_image
    ###

    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    def __str__(self):
        return self.username
    




