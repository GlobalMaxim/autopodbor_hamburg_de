// счётчик вместо прямого overflow='' на cleanup — несколько модалок могут быть открыты
// одновременно (например просмотрщик фото поверх папки темы), и закрытие внутренней
// не должно снимать блокировку прокрутки, пока внешняя всё еще открыта
let count = 0;

export function lockScroll() {
  if (count === 0) document.body.style.overflow = 'hidden';
  count++;
}

export function unlockScroll() {
  count = Math.max(0, count - 1);
  if (count === 0) document.body.style.overflow = '';
}
