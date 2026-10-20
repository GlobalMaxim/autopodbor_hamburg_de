from ninja import Router, Schema

from .models import ReportTopic

router = Router(tags=['process'])


class ReportMediaOut(Schema):
    media_type: str
    file: str

    @staticmethod
    def resolve_file(obj):
        return obj.file.url


class ReportTopicOut(Schema):
    name: str
    media: list[ReportMediaOut]

    @staticmethod
    def resolve_media(obj: ReportTopic):
        return obj.media.all()


@router.get('/topics', response=list[ReportTopicOut])
def list_topics(request):
    # темы без единого медиафайла на публичной странице не показываем
    return (
        ReportTopic.objects.filter(published=True)
        .prefetch_related('media')
        .filter(media__isnull=False)
        .distinct()
    )
