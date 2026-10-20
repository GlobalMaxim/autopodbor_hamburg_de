from django.db import models


class Verdict(models.TextChoices):
    GOOD = 'good', 'Рекомендуем'
    WARN = 'warn', 'Есть нюансы'
    BAD = 'bad', 'Не рекомендуем'


class Transmission(models.TextChoices):
    AUTOMATIC = 'automatic', 'Автомат'
    MANUAL = 'manual', 'Механика'
    ROBOT = 'robot', 'Робот (DSG/AMT)'
    CVT = 'cvt', 'Вариатор'


class Case(models.Model):
    title = models.CharField('Заголовок', max_length=200)
    slug = models.SlugField('Slug', unique=True)
    brand = models.CharField('Марка', max_length=100)
    model = models.CharField('Модель', max_length=100)
    year = models.PositiveIntegerField('Год')
    mileage = models.PositiveIntegerField('Пробег, км')
    price = models.PositiveIntegerField('Цена, €')
    engine = models.CharField('Двигатель', max_length=100)
    transmission = models.CharField('Коробка', max_length=20, choices=Transmission.choices)
    verdict = models.CharField('Вердикт', max_length=10, choices=Verdict.choices)

    client_task = models.TextField('Задача клиента', blank=True)
    process = models.TextField('Процесс', blank=True)
    inspection = models.TextField('Что проверяли', blank=True)
    findings = models.TextField('Что обнаружили', blank=True)
    decision = models.TextField('Решение', blank=True)
    result = models.TextField('Итог', blank=True)

    published = models.BooleanField('Опубликован', default=False)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлён', auto_now=True)

    class Meta:
        verbose_name = 'Кейс'
        verbose_name_plural = 'Кейсы'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.brand} {self.model} ({self.year})'


class CasePhoto(models.Model):
    case = models.ForeignKey(Case, related_name='photos', on_delete=models.CASCADE, verbose_name='Кейс')
    image = models.ImageField('Фото', upload_to='cases/photos/')
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Фото кейса'
        verbose_name_plural = 'Фото кейса'
        ordering = ['order']


class CaseVideo(models.Model):
    case = models.ForeignKey(Case, related_name='videos', on_delete=models.CASCADE, verbose_name='Кейс')
    video = models.FileField('Видео', upload_to='cases/videos/')
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Видео кейса'
        verbose_name_plural = 'Видео кейса'
        ordering = ['order']
