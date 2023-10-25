from pydantic import BaseModel


class PublishReq(BaseModel):
    topic: str
    key: str
    payload: object
