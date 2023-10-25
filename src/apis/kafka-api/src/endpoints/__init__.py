from fastapi import APIRouter

from . import publish_to_topic

router = APIRouter()

router.include_router(publish_to_topic.router)

__all__ = ["router"]
