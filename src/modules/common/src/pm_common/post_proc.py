from .root_cmd import RootCmd
from .publish_to_topic_cmd import PublishToTopicCmd
from .cmd_types import CmdTypes
from .cmd_categories import CmdCategories


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


def build_post_proc_status_update_persist_cmd(
    status: str, cmd: RootCmd, cmd_type: CmdTypes
) -> RootCmd:
    idempotency_id = cmd._idempotency_id_()
    project_id = cmd.cmd_metadata["project_id"]

    cmd_data = {
        "id": idempotency_id,
        "project_id": project_id,
        "status": status,
        "cmd_type": cmd_type.value,
    }

    cmd_metadata = {
        "cmd_post_op": {
            "store": {
                "trgt_bucket": "project_m",
                "trgt_scope": "definitions",
                "trgt_collection": "processes",
            },
        }
    }

    persist_cmd = RootCmd(
        cmd_category=CmdCategories.PERSIST.value,
        cmd_type=CmdTypes.PERSIST_TO_STORE.value,
        cmd_data=cmd_data,
        cmd_metadata=cmd_metadata,
    )

    return persist_cmd


def build_persist_cmd(payload: dict, cmd: RootCmd) -> RootCmd:
    store_metadata = cmd._cmd_post_op_store_()
    cmd = RootCmd(
        cmd_category=CmdCategories.PERSIST.value,
        cmd_type=CmdTypes.PERSIST_TO_STORE.value,
        cmd_data=payload,
        cmd_metadata={"cmd_post_op": {"store": store_metadata}},
    )

    return cmd
