from fastapi import APIRouter
from cb.cb_manager import CouchbaseQryManager, CbQry
from models.qry_req import QryReq
from couchbase.result import QueryResult
import logging

logging.basicConfig(level=logging.DEBUG)
router = APIRouter()
manager = CouchbaseQryManager()


@router.post("/qry")
async def query(req: QryReq):
    logging.info("Query received...")
    logging.debug(req)

    qry = CbQry(req.ql, req.params)

    try:
        result: QueryResult = manager.query(qry)

        rows = result.rows()
        json_result = list(rows)

        return {"result": json_result}

    except Exception as e:
        logging.error(e)
        return {"error": e, result: []}
