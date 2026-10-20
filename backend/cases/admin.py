from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline

from common.admin_mixins import IncrementingOrderInlineMixin
from .models import Case, CasePhoto, CaseVideo


class CasePhotoInline(IncrementingOrderInlineMixin, TabularInline):
    model = CasePhoto
    parent_fk_name = 'case'
    extra = 0
    fields = ['image', 'preview', 'order']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:6px" />', obj.image.url)
        return '—'

    preview.short_description = 'Превью'


class CaseVideoInline(IncrementingOrderInlineMixin, TabularInline):
    model = CaseVideo
    parent_fk_name = 'case'
    extra = 0
    fields = ['video', 'order']


@admin.register(Case)
class CaseAdmin(ModelAdmin):
    list_display = ['title', 'brand', 'model', 'year', 'verdict', 'published', 'created_at']
    list_filter = ['verdict', 'published', 'brand']
    search_fields = ['title', 'brand', 'model']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [CasePhotoInline, CaseVideoInline]
    fieldsets = (
        ('Автомобиль', {
            'fields': ('title', 'slug', 'brand', 'model', 'year', 'mileage', 'price', 'engine', 'transmission')
        }),
        ('Вердикт и описание', {
            'fields': ('verdict', 'client_task', 'process', 'inspection', 'findings', 'decision', 'result')
        }),
        ('Публикация', {
            'fields': ('published',)
        }),
    )
