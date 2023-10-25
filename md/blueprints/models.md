# couchbase api: command
class CmdReq(BaseModel):
    bucket_name: str
    scope_name: str
    collection_name: str
    key: str
    payload: str

# persist worker: command
class PersistProcessCmd(ProcessCmd):
    store_metadata: dict
    payload: dict

# kafka api: command
class PublishReq(BaseModel):
    topic: str
    key: str
    payload: dict

# azdo worker: kafka client: command
class PersistCmd(ProcessCmd):
    topic: str
    key: str
    payload: str
