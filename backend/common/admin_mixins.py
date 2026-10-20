from django.db.models import Max


class IncrementingOrderInlineMixin:
    """Новая пустая строка инлайна получает order = (макс. существующий + 1),
    а не статичный дефолт 0 — иначе несколько добавленных файлов подряд
    получают одинаковый order (0) и при сохранении путаются местами
    (визуально выглядит как "затёрло предыдущую запись")."""

    # имя FK-поля инлайн-модели на родителя, например 'case' или 'topic'
    parent_fk_name: str

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        next_order = 0
        if obj is not None and obj.pk is not None:
            existing_max = self.model.objects.filter(
                **{self.parent_fk_name: obj}
            ).aggregate(m=Max('order'))['m']
            # existing_max может быть 0 — 0 falsy в Python, `or` тут сломал бы
            # именно самый частый случай (первая запись имеет order=0)
            next_order = existing_max + 1 if existing_max is not None else 0
        formset.form.base_fields['order'].initial = next_order
        return formset
