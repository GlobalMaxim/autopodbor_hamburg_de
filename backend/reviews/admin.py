from django import forms
from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from common.admin_mixins import IncrementingOrderInlineMixin
from .models import Review, ReviewMedia
from .widgets import StarRatingWidget


class ReviewMediaInline(IncrementingOrderInlineMixin, TabularInline):
    model = ReviewMedia
    parent_fk_name = 'review'
    extra = 0
    fields = ['media_type', 'file', 'preview', 'order']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.media_type == 'photo' and obj.file:
            return format_html('<img src="{}" style="height:50px;border-radius:6px" />', obj.file.url)
        if obj.media_type == 'video' and obj.file:
            return '🎬'
        return '—'

    preview.short_description = 'Превью'


class ReviewAdminForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = '__all__'
        widgets = {'rating': StarRatingWidget}


@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    form = ReviewAdminForm
    list_display = ['name', 'rating', 'date', 'media_count', 'published']
    list_filter = ['published', 'rating']
    search_fields = ['name', 'text']
    inlines = [ReviewMediaInline]
    fieldsets = (
        ('Отзыв', {'fields': ('name', 'text', 'rating', 'date', 'source')}),
        ('TikTok', {'fields': ('tiktok_url',), 'description': 'Необязательно — ссылка на видео в TikTok'}),
        ('Публикация', {'fields': ('published',)}),
    )

    def media_count(self, obj):
        return obj.media.count()

    media_count.short_description = 'Медиафайлов'
