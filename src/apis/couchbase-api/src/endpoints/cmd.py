from fastapi import APIRouter
from cb.cb_manager import CouchbaseCmdManager, CbCmd
from models.cmd_req import CmdReq
import json

router = APIRouter()

mangers = {}


@router.post("/cmd")
async def command(req: CmdReq):
    manager = None
    key = f"{req.bucket_name}-{req.scope_name}-{req.collection_name}"

    if key not in mangers:
        manager = CouchbaseCmdManager(
            req.bucket_name, req.scope_name, req.collection_name
        )
        mangers[key] = manager
    else:
        manager = mangers[key]

    data = json.loads(req.payload)

    cb_cmd = CbCmd(req.key, data)

    await manager.command(cb_cmd)

    return {"status": "accepted"}
