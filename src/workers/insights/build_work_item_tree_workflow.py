from json import dumps as json_dumps
from json import loads as json_loads
from algos.build_summarized_work_item_tree import build_summarized_work_item_tree
from queries import safe_query, build_get_node_query_fn, build_get_node_fn, get_node_ids
from persists import persist_payload
from workflow_cmds import WorkflowCmd


def build_work_item_tree_workflow(cmd: WorkflowCmd) -> int:
    store_metadata = cmd.metadata["store"]
    bucket_name = store_metadata["bucket_name"]
    scope_name = store_metadata["scope_name"]
    root_collection_name = store_metadata["root_collection"]

    root_node_ids = get_node_ids(
        bucket_name=bucket_name,
        scope_name=scope_name,
        collection_name=root_collection_name,
    )
    get_raw_node_fn = build_get_node_fn(
        build_get_node_query_fn(bucket_name, scope_name)
    )

    summarized_nodes = []
    for node_id in root_node_ids:
        id = node_id["id"]
        summary = build_summarized_work_item_tree(
            id, root_collection_name, get_raw_node_fn
        )
        summarized_nodes.append(summary)

    tree = {"id": "summarized_tree", "type": "root", "children": summarized_nodes}

    persist_payload(store_metadata=store_metadata, payload=tree)
