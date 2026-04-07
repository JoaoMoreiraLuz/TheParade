from django.contrib import admin
from django.urls import include, path

from backend.base import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include('core.urls')),
    path("api/", include("base.urls"))
]
