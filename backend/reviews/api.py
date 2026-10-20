from datetime import date as date_type

from ninja import Router, Schema

from .models import Review

router = Router(tags=['reviews'])


class ReviewMediaOut(Schema):
    media_type: str
    file: str

    @staticmethod
    def resolve_file(obj):
        return obj.file.url


class ReviewOut(Schema):
    name: str
    text: str
    rating: int | None
    date: date_type | None
    source: str
    tiktok_url: str | None
    media: list[ReviewMediaOut]

    @staticmethod
    def resolve_tiktok_url(obj: Review):
        return obj.tiktok_url or None

    @staticmethod
    def resolve_media(obj: Review):
        return obj.media.all()


@router.get('', response=list[ReviewOut])
def list_reviews(request):
    return Review.objects.filter(published=True).prefetch_related('media')
