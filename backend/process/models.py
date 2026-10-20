from django.db import models


class ReportMediaType(models.TextChoices):
    PHOTO = 'photo', 'Фото'
    VIDEO = 'video', 'Видео'


class ReportTopic(models.Model):
    name = models.CharField('Название темы', max_length=100)
    order = models.PositiveIntegerField('Порядок', default=0)
    published = models.BooleanField('Опубликован', default=False)

    class Meta:
        verbose_name = 'Тема примера отчёта'
        verbose_name_plural = 'Темы примера отчёта'
        ordering = ['order']

    def __str__(self):
        return self.name


class ReportTopicMedia(models.Model):
    topic = models.ForeignKey(ReportTopic, related_name='media', on_delete=models.CASCADE, verbose_name='Тема')
    media_type = models.CharField('Тип', max_length=10, choices=ReportMediaType.choices)
    file = models.FileField('Файл', upload_to='process/media/')
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Медиафайл темы'
        verbose_name_plural = 'Медиафайлы темы'
        ordering = ['order']
