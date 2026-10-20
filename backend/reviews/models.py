from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class ReviewMediaType(models.TextChoices):
    PHOTO = 'photo', 'Фото'
    VIDEO = 'video', 'Видео'


class Review(models.Model):
    name = models.CharField('Имя клиента', max_length=100, blank=True)
    text = models.TextField('Текст отзыва')
    rating = models.PositiveSmallIntegerField(
        'Рейтинг', blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    date = models.DateField('Дата', blank=True, null=True)
    source = models.CharField('Источник', max_length=50, blank=True, help_text='Google, Telegram и т.п.')
    tiktok_url = models.URLField('Ссылка на TikTok', blank=True)

    published = models.BooleanField('Опубликован', default=False)
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return self.name or f'Отзыв #{self.pk}'


class ReviewMedia(models.Model):
    review = models.ForeignKey(Review, related_name='media', on_delete=models.CASCADE, verbose_name='Отзыв')
    media_type = models.CharField('Тип', max_length=10, choices=ReviewMediaType.choices)
    file = models.FileField('Файл', upload_to='reviews/media/')
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Медиафайл отзыва'
        verbose_name_plural = 'Медиафайлы отзыва'
        ordering = ['order']
