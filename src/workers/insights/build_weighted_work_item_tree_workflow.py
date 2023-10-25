from algos.build_risk_weighted_work_item_tree import build_risk_weighted_work_item_tree
from queries import build_get_node_query_fn, build_get_node_fn, get_node_ids
from persists import persist_payload
from pm_common import RootCmd


BUCKET_NAME = "project_m"
SCOPE_NAME = "azdo"


def build_weighted_work_item_tree_workflow(cmd: RootCmd) -> int:
    root_collection_name = cmd.cmd_data["root_collection"]

    root_node_ids = get_node_ids(
        bucket_name=BUCKET_NAME,
        scope_name=SCOPE_NAME,
        collection_name=root_collection_name,
    )

    get_node_fn = build_get_node_fn(build_get_node_query_fn(BUCKET_NAME, SCOPE_NAME))

    structured_nodes = []
    for node_id in root_node_ids:
        id = node_id["id"]
        structure = build_risk_weighted_work_item_tree(
            id, root_collection_name, get_node_fn
        )
        structured_nodes.append(structure)

    tree = {"id": "weighted_tree", "type": "root", "children": structured_nodes}

    persist_payload(
        payload=tree,
        cmd=cmd,
    )
