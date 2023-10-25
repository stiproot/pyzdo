from pm_common import (
    RootCmd,
    PublishToTopicCmdProcessor,
    KafkaHttpClient,
    CmdTypes,
    AzdoProxyHttpClient,
    EnvVarProvider,
    build_post_proc_status_update_persist_cmd,
    build_publish_to_topic_cmd,
)


env_var_provider = EnvVarProvider()
PERSIST_TOPIC = env_var_provider.get_env_var(
    "PERSIST_TOPIC", "topic_projectm_cmd_persist"
)
PERSIST_URL = env_var_provider.get_env_var(
    "PERSIST_URL", "http://localhost:8001/kafka/topic/publish"
)
AZDO_PROXY_BASE_URL = env_var_provider.get_env_var(
    "AZDO_PROXY_BASE_URL", "http://mandy-azdo-proxy-api:80"
)

persist_proc = PublishToTopicCmdProcessor(KafkaHttpClient(base_url=PERSIST_URL))
azdo_proxy_client = AzdoProxyHttpClient(base_url=AZDO_PROXY_BASE_URL)


def process_azdo_proxy_cmd_workflow(cmd: RootCmd) -> int:
    cmd_type = cmd.cmd_type
    cmd_data = cmd.cmd_data

    resp = None
    if cmd_type == CmdTypes.BULK_CREATE_UNITS_OF_WORK:
        resp = azdo_proxy_client.bulkCreateWi(cmd_data)
    elif cmd_type == CmdTypes.CLONE_UNIT_OF_WORK:
        resp = azdo_proxy_client.cloneWi(cmd_data)
    elif cmd_type == CmdTypes.CREATE_DASHBOARD:
        resp = azdo_proxy_client.createDashboard(cmd_data)
    else:
        raise Exception("Unknown cmd_type")

    print("resp", resp)

    proc_status_update_persist_cmd = build_post_proc_status_update_persist_cmd(
        status="COMPLETE", cmd=cmd, cmd_type=cmd_type
    )
    proc_status_update_publish_to_topic_cmd = build_publish_to_topic_cmd(
        proc_status_update_persist_cmd, PERSIST_TOPIC
    )
    persist_proc.process(proc_status_update_publish_to_topic_cmd)
