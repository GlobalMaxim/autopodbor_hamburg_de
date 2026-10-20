from django.shortcuts import get_object_or_404
from ninja import Router, Schema

from .models import Case

router = Router(tags=['cases'])


class CaseOut(Schema):
    slug: str
    title: str
    brand: str
    model: str
    year: int
    mileage: int
    price: int
    engine: str
    transmission: str
    verdict: str
    client_task: str
    process: str
    inspection: str
    findings: str
    decision: str
    result: str
    photos: list[str]
    videos: list[str]

    @staticmethod
    def resolve_photos(obj: Case):
        return [p.image.url for p in obj.photos.all()]

    @staticmethod
    def resolve_videos(obj: Case):
        return [v.video.url for v in obj.videos.all()]


class CaseListOut(Schema):
    slug: str
    title: str
    brand: str
    model: str
    year: int
    price: int
    verdict: str
    cover: str | None

    @staticmethod
    def resolve_cover(obj: Case):
        first = obj.photos.first()
        return first.image.url if first else None


@router.get('', response=list[CaseListOut])
def list_cases(request):
    return Case.objects.filter(published=True).prefetch_related('photos')


@router.get('/{slug}', response=CaseOut)
def get_case(request, slug: str):
    return get_object_or_404(
        Case.objects.prefetch_related('photos', 'videos'), slug=slug, published=True
    )
