from fastapi import APIRouter
from cb.cb_manager import CouchbaseQryManager, CbQry
from models.qry_req import QryReq
from couchbase.result import QueryResult

router = APIRouter()
manager = CouchbaseQryManager()


@router.post("/qry")
async def query(req: QryReq):
    qry = CbQry(req.ql, req.params)
    result: QueryResult = manager.query(qry)
    rows = result.rows()
    json_result = list(rows)

    return {"result": json_result}
