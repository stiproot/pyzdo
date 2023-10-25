from pydantic import BaseModel


class CmdReq(BaseModel):
    bucket_name: str
    scope_name: str
    collection_name: str
    key: str
    payload: str
