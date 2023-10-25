from json import dumps as json_dumps
from json import loads as json_loads
from pm_common import CouchbaseHttpClient, EnvVarProvider


env_var_provider = EnvVarProvider()
STORE_URL = env_var_provider.get_env_var("STORE_URL", "http://localhost:8000/cb/qry")
couchbase_http_client = CouchbaseHttpClient(base_url=STORE_URL)


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
