from get_wi_details_cmd_processor import GetWiDetailsCmdProcessor, GetWiDetailsCmd
from get_wis_by_wiql_cmd_processor import GetWisByWiqlCmdProcessor, GetWisByWiqlCmd
from pm_common import (
    PublishToTopicCmdProcessor,
    EnvVarProvider,
    KafkaHttpClient,
    RootCmd,
    CmdTypes,
    build_persist_cmd,
    build_post_proc_status_update_persist_cmd,
    build_publish_to_topic_cmd,
    enrich_payload,
)

env_var_provider = EnvVarProvider()

PERSIST_TOPIC = env_var_provider.get_env_var(
    "PERSIST_TOPIC", "topic_projectm_cmd_persist"
)

PERSIST_URL = env_var_provider.get_env_var(
    "PERSIST_URL", "http://localhost:9092/kafka-api/publish"
)

wi_by_wiql_proc = GetWisByWiqlCmdProcessor()
wi_details_proc = GetWiDetailsCmdProcessor()
persist_proc = PublishToTopicCmdProcessor(KafkaHttpClient(base_url=PERSIST_URL))


def gather_project_units_of_work_workflow(cmd: RootCmd) -> int:
    ql = cmd.cmd_data["ql"]
    get_by_wiql_cmd = GetWisByWiqlCmd(query=ql)

    wis_resp = wi_by_wiql_proc.process(cmd=get_by_wiql_cmd)
    wis = list(wis_resp["workItems"])
    if len(wis) == 0:
        return 1

    details = []
    for wi in wis:
        id = int(wi["id"])
        print(f"Attempting to get work item details: {id}")
        get_details_cmd = GetWiDetailsCmd(id=id)
        details_resp = wi_details_proc.process(get_details_cmd)
        details.append(details_resp)

    for wi in details:
        enrich_payload(wi, cmd)
        persist_cmd = build_persist_cmd(wi, cmd)
        publish_to_topic_cmd = build_publish_to_topic_cmd(persist_cmd, PERSIST_TOPIC)
        persist_proc.process(publish_to_topic_cmd)

    proc_status_update_persist_cmd = build_post_proc_status_update_persist_cmd(
        status="COMPLETE", cmd=cmd, cmd_type=CmdTypes.GATHER_PROJECT_UNITS_OF_WORK
    )
    proc_status_update_publish_to_topic_cmd = build_publish_to_topic_cmd(
        proc_status_update_persist_cmd, PERSIST_TOPIC
    )
    persist_proc.process(proc_status_update_publish_to_topic_cmd)
