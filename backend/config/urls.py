from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from config.api import api

admin.site.site_header = 'AutoPodbor Hamburg'
admin.site.site_title = 'AutoPodbor Hamburg'
admin.site.index_title = 'Панель управления'

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('api/', api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
