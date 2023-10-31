from pydantic import BaseModel
from typing import Optional


# class CmdReq(BaseModel):
#     bucket_name: str
#     scope_name: str
#     collection_name: str
#     key: str
#     payload: str
#     post_cmd_op: Optional[dict] = None


class CmdReq(BaseModel):
    cmd_data: dict
    cmd_metadata: dict

    # bucket_name: str
    # scope_name: str
    # collection_name: str
    # key: str
    # payload: str
    # post_cmd_op: Optional[dict] = None


class BulkCmdReq(BaseModel):
    cmd_data: list[CmdReq]
    cmd_metadata: dict
