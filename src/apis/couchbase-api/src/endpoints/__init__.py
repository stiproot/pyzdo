from fastapi import APIRouter

from . import qry
from . import cmd

router = APIRouter()

router.include_router(qry.router)
router.include_router(cmd.router)

__all__ = ["router"]
