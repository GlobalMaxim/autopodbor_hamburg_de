from django import forms
from django.utils.safestring import mark_safe


class StarRatingWidget(forms.Widget):
    """Кликабельные звёзды вместо голого числового поля. Рейтинг необязателен —
    есть кнопка "очистить", чтобы оставить поле пустым."""

    # render() полностью свой, шаблон не используется — но некоторый код
    # (в т.ч. Unfold) обращается к template_name безусловно
    template_name = 'django/forms/widgets/text.html'

    def render(self, name, value, attrs=None, renderer=None):
        widget_id = (attrs or {}).get('id', f'id_{name}')
        value = int(value) if value not in (None, '') else 0

        stars = ''.join(
            f'<span class="star-rating__star" data-value="{i}">★</span>' for i in range(1, 6)
        )

        return mark_safe(f'''
<div class="star-rating" id="{widget_id}_wrap">
  <input type="hidden" name="{name}" id="{widget_id}" value="{value or ''}">
  <div class="star-rating__stars">{stars}</div>
  <button type="button" class="star-rating__clear">очистить</button>
</div>
<style>
  .star-rating {{ display: flex; align-items: center; gap: 10px; }}
  .star-rating__stars {{ display: inline-flex; gap: 2px; font-size: 28px; line-height: 1; cursor: pointer; }}
  .star-rating__star {{ color: #d1d5db; transition: color .1s; }}
  .star-rating__star.is-filled {{ color: #e92031; }}
  .star-rating__clear {{
    font-size: 12px; color: #798085; background: none; border: none;
    cursor: pointer; text-decoration: underline; padding: 0;
  }}
</style>
<script>
(function() {{
  var wrap = document.getElementById("{widget_id}_wrap");
  if (!wrap || wrap.dataset.bound) return;
  wrap.dataset.bound = "1";
  var input = document.getElementById("{widget_id}");
  var starsWrap = wrap.querySelector(".star-rating__stars");
  var stars = wrap.querySelectorAll(".star-rating__star");

  function paint(v) {{
    stars.forEach(function(s) {{
      s.classList.toggle("is-filled", parseInt(s.dataset.value, 10) <= v);
    }});
  }}

  paint(parseInt(input.value, 10) || 0);

  stars.forEach(function(s) {{
    s.addEventListener("mouseenter", function() {{ paint(parseInt(s.dataset.value, 10)); }});
    s.addEventListener("click", function() {{
      input.value = s.dataset.value;
      paint(parseInt(s.dataset.value, 10));
    }});
  }});

  starsWrap.addEventListener("mouseleave", function() {{
    paint(parseInt(input.value, 10) || 0);
  }});

  wrap.querySelector(".star-rating__clear").addEventListener("click", function() {{
    input.value = "";
    paint(0);
  }});
}})();
</script>
''')

    def value_from_datadict(self, data, files, name):
        value = data.get(name)
        return value or None
