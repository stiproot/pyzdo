from pydantic import BaseModel
from typing import List


class QryReq(BaseModel):
    ql: str
    params: List[str]
