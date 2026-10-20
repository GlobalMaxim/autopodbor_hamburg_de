from ninja import NinjaAPI

from cases.api import router as cases_router
from process.api import router as process_router
from reviews.api import router as reviews_router

# публичный read-only API — Next.js читает отсюда опубликованный контент.
# редактирование происходит только через Django admin, этот API его не отдаёт.
api = NinjaAPI(title='AutoPodbor Hamburg API', urls_namespace='api')

api.add_router('/cases', cases_router)
api.add_router('/reviews', reviews_router)
api.add_router('/process', process_router)
