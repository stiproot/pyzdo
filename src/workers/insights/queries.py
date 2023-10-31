from json import dumps as json_dumps
from json import loads as json_loads
from pm_common import CouchbaseHttpClient, EnvVarProvider, RootCmd
import logging

logging.basicConfig(level=logging.DEBUG)

env_var_provider = EnvVarProvider()
STORE_QUERY_URL = env_var_provider.get_env_var(
    "STORE_QUERY_URL", "http://localhost:8000/cb/qry"
)
couchbase_http_client = CouchbaseHttpClient(base_url=STORE_QUERY_URL)


COLLECTIONS = [
    "initiatives",
    "epics",
    "features",
    "user_stories",
    "tasks",
    "bugs",
    "impediments",
]

WORK_ITEM_TYPE_COLLECTION_HASH = {
    "Initiative": "initiatives",
    "Epic": "epics",
    "Feature": "features",
    "User Story": "user_stories",
    "Task": "tasks",
    "Bug": "bugs",
    "Impediment": "impediments",
}


def get_wi_collection_hash_for_project(cmd: RootCmd) -> str:
    project_id = cmd.cmd_metadata["project_id"]
    collection_hash = {}

    for c in COLLECTIONS:
        n1ql = f"SELECT * FROM project_m.azdo.{c} WHERE __metadata__.project_id = '{project_id}'"
        q = {
            "ql": n1ql,
            "params": [],
        }

        try:
            resp = couchbase_http_client.query(json_dumps(q))
            obj = json_loads(resp.text)
            hash = {}
            for raw_item in obj["result"]:
                item = raw_item[c]
                hash[item["id"]] = item
            collection_hash[c] = hash
        except:
            logging.error(f"Error collection ({c}) for project '{project_id}'")

    return collection_hash


def get_wi_root_collection_from_collection_hash(hash: dict) -> str:
    for c in COLLECTIONS:
        if len(hash.get(c, {})) > 0:
            return c

    raise Exception("Could not find root collection")


# def get_wi_root_collection_for_project(cmd: RootCmd) -> str:
#     root_collection_name = cmd.cmd_data.get("root_collection", None)
#     if root_collection_name is not None:
#         return root_collection_name

#     project_id = cmd.cmd_metadata["project_id"]

#     for c in COLLECTIONS:
#         n1ql = f"SELECT id FROM project_m.azdo.{c} WHERE __metadata__.project_id = '{project_id}'"
#         q = {
#             "ql": n1ql,
#             "params": [],
#         }

#         try:
#             resp = couchbase_http_client.query(json_dumps(q))
#             obj = json_loads(resp.text)
#             if len(obj["result"]) > 0:
#                 return c
#         except:
#             print(f"{c} is not root collection for project {project_id}")

#     raise Exception(f"Could not find root collection for project {project_id}")


def safe_query(qry: str, node_type: str) -> dict:
    http_resp = couchbase_http_client.query(qry)
    resp_content = http_resp.text
    structured_resp = json_loads(resp_content)
    result = structured_resp["result"]
    if len(result) == 0:
        return {}

    item = result[0][node_type]
    return item


def build_get_node_fn(build_get_node_query_fn):
    return lambda node_id, node_type: (
        safe_query(build_get_node_query_fn(node_id, node_type), node_type)
    )


def build_raw_node_query(
    bucket_name: str,
    scope_name: str,
    collection_name: str,
    node_id: str,
) -> str:
    return f"select * from {bucket_name}.{scope_name}.{collection_name} where id = {node_id}"


def build_get_node_query_fn(bucket_name: str, scope_name: str):
    return lambda node_id, node_type: json_dumps(
        {
            "ql": build_raw_node_query(bucket_name, scope_name, node_type, node_id),
            "params": [],
        }
    )


def get_node_ids(bucket_name: str, scope_name: str, collection_name: str) -> list:
    n1ql = f"SELECT id FROM {bucket_name}.{scope_name}.{collection_name}"
    node_ids_query = {
        "ql": n1ql,
        "params": [],
    }

    resp = couchbase_http_client.query(json_dumps(node_ids_query))
    obj = json_loads(resp.text)
    return obj["result"]
