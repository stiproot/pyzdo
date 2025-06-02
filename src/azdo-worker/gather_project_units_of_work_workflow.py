from get_wis_by_wiql_cmd_processor import GetWisByWiqlCmdProcessor, GetWisByWiqlCmd
from get_wis_list_cmd_processor import GetWisListCmdProcessor, GetWisListCmd
from pyzdo_core import (
    PublishToTopicCmdProcessor,
    EnvVarProvider,
    KafkaHttpClient,
    RootCmd,
    CmdTypes,
    CmdCategories,
    build_bulk_publish_to_topic_cmd,
    enrich_payload,
)

env_var_provider = EnvVarProvider()

PERSIST_TOPIC = env_var_provider.get_env_var(
    "PERSIST_TOPIC", "topic_projectm_cmd_persist"
)
PERSIST_URL = env_var_provider.get_env_var(
    "PERSIST_URL", "http://localhost:9092/kafka-api/publish"
)
MAX_WORK_ITEMS_PER_QUERY = 100
MAX_PERSIST_BATCH_SIZE = 50

persist_proc = PublishToTopicCmdProcessor(KafkaHttpClient(base_url=PERSIST_URL))
wi_by_wiql_proc = GetWisByWiqlCmdProcessor()
wis_list_proc = GetWisListCmdProcessor()

trgt_collection_hash = {
    "Initiative": "initiatives",
    "Epic": "epics",
    "Feature": "features",
    "User Story": "user_stories",
    "Task": "tasks",
    "Bug": "bugs",
    "Impediment": "impediments",
    "Programme": "programmes",
    "Medium Project": "medium_projects",
}


def get_trgt_collection(payload: dict) -> str:
    wi_type = payload["fields"]["System.WorkItemType"]
    trgt_collection = trgt_collection_hash.get(wi_type, "null")
    return trgt_collection


def build_bulk_persist_cmd(
    payloads: list, cmd: RootCmd, batch_no: int = 1, batches: int = 1
) -> RootCmd:
    cmd_metadata = cmd.cmd_metadata.copy()
    cmd_metadata["batch"] = f"{batch_no}/{batches}"

    cmds = []
    for p in payloads:
        store_metadata = cmd._cmd_post_op_store_().copy()

        trgt_collection = get_trgt_collection(p)
        store_metadata["trgt_collection"] = trgt_collection
        store_metadata["key"] = str(p["id"])

        cmd = RootCmd(
            cmd_category=CmdCategories.PERSIST.value,
            cmd_type=CmdTypes.PERSIST_TO_STORE.value,
            cmd_data=p,
            cmd_metadata={"cmd_post_op": {"store": store_metadata}},
        )
        cmds.append(cmd._to_dict_())

    bulk_cmd = RootCmd(
        cmd_category=CmdCategories.PERSIST.value,
        cmd_type=CmdTypes.BULK_PERSIST_TO_STORE.value,
        cmd_data=cmds,
        cmd_metadata=cmd_metadata,
    )

    return bulk_cmd


def get_batch_work_items(ids: list[int]) -> list[dict]:
    if len(ids) > MAX_WORK_ITEMS_PER_QUERY:
        raise ValueError(f"Too many work items: {len(ids)}")

    get_wis_list_cmd = GetWisListCmd(ids=ids)
    wis_list_resp = wis_list_proc.process(cmd=get_wis_list_cmd)
    wis_list = wis_list_resp["value"]
    return wis_list


def get_work_item_details_in_batches(ids: list[int]) -> list[dict]:
    batches = []
    batch = []
    for id in ids:
        if len(batch) == MAX_WORK_ITEMS_PER_QUERY:
            batches.append(batch)
            batch = []
        batch.append(id)
    if len(batch) > 0:
        batches.append(batch)

    wis_list = []
    for batch in batches:
        wis_list.extend(get_batch_work_items(batch))

    return wis_list


def get_work_item_details(wis: list[dict]) -> list[dict]:
    ids = [int(wi["id"]) for wi in wis]

    if len(ids) == 0:
        return []

    if len(ids) > MAX_WORK_ITEMS_PER_QUERY:
        return get_work_item_details_in_batches(ids)

    return get_batch_work_items(ids)


def persist_batch(cmd: RootCmd, payloads: list[dict], batch_no: int = 0):
    bulk_persist_cmd = build_bulk_persist_cmd(payloads, cmd)
    publish_to_topic_cmd = build_bulk_publish_to_topic_cmd(
        bulk_persist_cmd, PERSIST_TOPIC
    )
    persist_proc.process(publish_to_topic_cmd)


def persist_in_batches(cmd: RootCmd, payloads: list[dict]):
    batches = []
    batch = []
    for p in payloads:
        if len(batch) == MAX_PERSIST_BATCH_SIZE:
            batches.append(batch)
            batch = []
        batch.append(p)
    if len(batch) > 0:
        batches.append(batch)

    for batch in batches:
        persist_batch(cmd, batch)


def gather_project_units_of_work_workflow(cmd: RootCmd) -> int:
    ql = cmd.cmd_data["ql"]
    get_by_wiql_cmd = GetWisByWiqlCmd(query=ql)

    wis_resp = wi_by_wiql_proc.process(cmd=get_by_wiql_cmd)
    wis = list(wis_resp["workItems"])

    if len(wis) == 0:
        return 1

    details = get_work_item_details(wis)
    for wi in details:
        enrich_payload(wi, cmd)

    persist_in_batches(cmd, details)

    # bulk_persist_cmd = build_bulk_persist_cmd(details, cmd)
    # publish_to_topic_cmd = build_bulk_publish_to_topic_cmd(
    #     bulk_persist_cmd, PERSIST_TOPIC
    # )
    # persist_proc.process(publish_to_topic_cmd)
