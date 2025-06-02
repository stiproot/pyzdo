from .root_cmd import RootCmd
from .publish_to_topic_cmd import PublishToTopicCmd
from .cmd_types import CmdTypes
from .cmd_categories import CmdCategories
from .http_clients.couchbase_http_client import CouchbaseHttpClient
from .utils.env_var_provider import EnvVarProvider
from json import dumps as json_dumps

env_var_provider = EnvVarProvider()
STORE_QUERY_URL = env_var_provider.get_env_var(
    "STORE_QUERY_URL", "http://localhost:8000/cb/qry"
)
couchbase_http_client = CouchbaseHttpClient(base_url=STORE_QUERY_URL)


def enrich_payload(payload: dict, cmd: RootCmd) -> None:
    add_map = cmd._cmd_post_op_enrichement_map_()
    for m in add_map:
        payload[m["key"]] = m["val"]


def build_publish_to_topic_cmd(cmd: RootCmd, topic: str) -> PublishToTopicCmd:
    key = str(cmd.cmd_data.get("id", 0))
    cmd = PublishToTopicCmd(
        topic=topic,
        key=key,
        payload=cmd._to_dict_(),
    )

    return cmd


def build_bulk_publish_to_topic_cmd(cmd: RootCmd, topic: str) -> PublishToTopicCmd:
    key = "0"
    cmd = PublishToTopicCmd(
        topic=topic,
        key=key,
        payload=cmd._to_dict_(),
    )

    return cmd


# DEPRECATED...
# def build_post_proc_status_update_persist_cmd(
#     status: str, cmd: RootCmd, cmd_type: CmdTypes
# ) -> RootCmd:
#     idempotency_id = cmd._idempotency_id_()
#     project_id = cmd.cmd_metadata["project_id"]

#     cmd_data = {
#         "id": idempotency_id,
#         "project_id": project_id,
#         "status": status,
#         "cmd_type": cmd_type.value,
#     }

#     cmd_metadata = {
#         "cmd_post_op": {
#             "store": {
#                 "trgt_bucket": "pyzdo",
#                 "trgt_scope": "definitions",
#                 "trgt_collection": "processes",
#             },
#         }
#     }

#     persist_cmd = RootCmd(
#         cmd_category=CmdCategories.PERSIST.value,
#         cmd_type=CmdTypes.PERSIST_TO_STORE.value,
#         cmd_data=cmd_data,
#         cmd_metadata=cmd_metadata,
#     )

#     return persist_cmd


def build_persist_cmd(payload: dict, cmd: RootCmd) -> RootCmd:
    cmd = RootCmd(
        cmd_category=CmdCategories.PERSIST.value,
        cmd_type=CmdTypes.PERSIST_TO_STORE.value,
        cmd_data=payload,
        # cmd_metadata={"cmd_post_op": {"store": store_metadata}},
        cmd_metadata=cmd.cmd_metadata,
    )

    return cmd


def build_post_proc_status_update_persist_qry(status: str, cmd: RootCmd) -> str:
    idempotency_id = cmd._idempotency_id_()
    project_id = cmd.cmd_metadata["project_id"]

    n1ql = f"UPDATE pyzdo.definitions.processes as c set c.status = '{status}' where c.id = '{idempotency_id}' AND c.project_id = '{project_id}'"

    return n1ql


def update_proc_status(status: str, cmd: RootCmd):
    batch = cmd.cmd_metadata.get("batch", "1/1")
    batch_no, batches = batch.split("/")

    if batch_no != batches:
        return

    n1ql = build_post_proc_status_update_persist_qry(status, cmd)
    q = {
        "ql": n1ql,
        "params": [],
    }
    json = json_dumps(q)

    try:
        couchbase_http_client.query(json)
    except:
        print(f"Error updating process status: {json}")
