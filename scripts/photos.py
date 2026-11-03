#!/usr/bin/env python3
"""Подготовка фото для видеоотчёта.

Берёт оригиналы из inbox/<slug>/ и кладёт готовые WebP в public/reports/<slug>/.

    python3 scripts/photos.py bmw-x5-2021

Структура inbox/<slug>/ повторяет public/reports/<slug>/:
    cover.jpg            обложка для списка отчётов (режется до 4:3, 900 px)
    main/                фото для шапки страницы
    common/              остальные фото: видны в просмотрщике после клика на «+N»

Фото уменьшаются до 1600 px по длинной стороне, EXIF (геометки, модель телефона)
удаляется, файлы нумеруются 01.webp, 02.webp... в порядке имён.
К каждому фото создаётся превью 01-thumb.webp (480 px) для сеток и плиток.
"""
import argparse
import json
import re
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "inbox"
MANIFESTS = ROOT / "content" / "photos"
OUT = ROOT / "public" / "reports"
SOURCE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif"}
FOLDERS = {"main", "common"}
FULL_SIZE = 1600
THUMB_SIZE = 480
COVER_SIZE = (900, 675)
QUALITY = 80


def natural_key(p: Path):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", p.name)]


def open_image(path: Path) -> Image.Image:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)  # применяем поворот из EXIF, сам EXIF не сохраняем
    return img.convert("RGB")


def save_webp(img: Image.Image, dest: Path, quality: int = QUALITY) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=quality, method=6)


def process_folder(src: Path, dst: Path) -> int:
    files = sorted(
        (f for f in src.iterdir() if f.is_file() and f.suffix.lower() in SOURCE_EXT),
        key=natural_key,
    )
    if not files:
        return 0
    if dst.exists():
        shutil.rmtree(dst)  # пересобираем папку целиком, чтобы нумерация не ломалась
    for i, f in enumerate(files, start=1):
        img = open_image(f)
        img.thumbnail((FULL_SIZE, FULL_SIZE), Image.LANCZOS)
        save_webp(img, dst / f"{i:02d}.webp")
        img.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.LANCZOS)
        save_webp(img, dst / f"{i:02d}-thumb.webp", quality=75)
    return len(files)


def process_cover(src: Path, dst_dir: Path) -> bool:
    cover = next(
        (f for f in src.iterdir() if f.is_file() and f.stem.lower() == "cover" and f.suffix.lower() in SOURCE_EXT),
        None,
    )
    if not cover:
        return False
    img = ImageOps.fit(open_image(cover), COVER_SIZE, Image.LANCZOS)
    for old in dst_dir.glob("cover.*"):
        old.unlink()
    save_webp(img, dst_dir / "cover.webp")
    return True


def write_manifest(slug: str, dst: Path) -> None:
    """content/photos/<slug>.json — сколько фото лежит в хранилище; сайт строит из этого адреса."""

    def count(folder: str) -> int:
        d = dst / folder
        return len([f for f in d.glob("*.webp") if not f.stem.endswith("-thumb")]) if d.is_dir() else 0

    manifest = {"cover": (dst / "cover.webp").exists(), "main": count("main"), "common": count("common")}
    MANIFESTS.mkdir(parents=True, exist_ok=True)
    (MANIFESTS / f"{slug}.json").write_text(json.dumps(manifest, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"список: content/photos/{slug}.json → {manifest}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("slug", help="имя папки в inbox/, например bmw-x5-2021")
    slug = parser.parse_args().slug

    src = INBOX / slug
    if not src.is_dir():
        print(f"Нет папки {src.relative_to(ROOT)}. Положи туда оригиналы.", file=sys.stderr)
        return 1

    dst = OUT / slug
    dst.mkdir(parents=True, exist_ok=True)

    total = 0
    if process_cover(src, dst):
        print("cover: ok")
        total += 1

    for sub in sorted(p for p in src.iterdir() if p.is_dir()):
        if sub.name not in FOLDERS:
            print(f"{sub.name}: пропущено, неизвестная папка. Доступны: {', '.join(sorted(FOLDERS))}")
            continue
        n = process_folder(sub, dst / sub.name)
        print(f"{sub.name}: {n} фото")
        total += n

    write_manifest(slug, dst)
    print(f"Готово: {total} файлов в {dst.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
