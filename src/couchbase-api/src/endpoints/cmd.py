from fastapi import APIRouter
from cb.cb_manager import CouchbaseCmdManager, CbCmd
from models.cmd_req import CmdReq, BulkCmdReq
import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()
cmd_mangers = {}


def get_cmd_manager(req: CmdReq) -> CouchbaseCmdManager:
    cmd_post_op = req.cmd_metadata["cmd_post_op"]
    store = cmd_post_op["store"]
    bucket_name = store["trgt_bucket"]
    scope_name = store["trgt_scope"]
    collection_name = store["trgt_collection"]

    cmd_manager = None

    key = f"{bucket_name}-{scope_name}-{collection_name}"

    if key not in cmd_mangers:
        cmd_manager = CouchbaseCmdManager(bucket_name, scope_name, collection_name)
        cmd_mangers[key] = cmd_manager
    else:
        cmd_manager = cmd_mangers[key]

    return cmd_manager


def get_key(cmd_req: CmdReq):
    cmd_post_op_metadata = cmd_req.cmd_metadata["cmd_post_op"]
    store_metadata = cmd_post_op_metadata["store"]
    key = store_metadata.get("key", None)

    if key is None:
        key = cmd_req.cmd_data.get("id", None)
        if key is None:
            logging.error("Key not found in cmd metadata or cmd data")
            raise Exception("Key not found in cmd metadata or cmd data")
    return key


@router.post("/cmd")
async def command(req: CmdReq):
    logging.info("Command received...")
    logging.debug(req)

    cmd_manager = get_cmd_manager(req)

    key = get_key(req)
    data = req.cmd_data

    if not isinstance(data, list):
        logging.debug("cmd_data is not a list...")
        cb_cmd = CbCmd(key, data)
        await cmd_manager.command(cb_cmd)
        return {"status": "accepted"}

    for d in data:
        cb_cmd = CbCmd(key, d)
        await cmd_manager.command(cb_cmd)
    return {"status": "accepted"}


@router.post("/cmds")
async def command(req: BulkCmdReq):
    logging.info("Bulk command received...")
    logging.debug(req)

    for cmd_req in req.cmd_data:
        cmd_manager = get_cmd_manager(cmd_req)

        key = get_key(cmd_req)
        data = cmd_req.cmd_data

        cb_cmd = CbCmd(key, data)

        await cmd_manager.command(cb_cmd)

    return {"status": "accepted"}
