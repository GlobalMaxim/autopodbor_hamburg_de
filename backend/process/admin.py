from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from common.admin_mixins import IncrementingOrderInlineMixin
from .models import ReportTopic, ReportTopicMedia


class ReportTopicMediaInline(IncrementingOrderInlineMixin, TabularInline):
    model = ReportTopicMedia
    parent_fk_name = 'topic'
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


@admin.register(ReportTopic)
class ReportTopicAdmin(ModelAdmin):
    list_display = ['name', 'order', 'media_count', 'published']
    list_filter = ['published']
    list_editable = ['order']
    search_fields = ['name']
    inlines = [ReportTopicMediaInline]

    def media_count(self, obj):
        return obj.media.count()

    media_count.short_description = 'Медиафайлов'
