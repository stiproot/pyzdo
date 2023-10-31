from pm_common import (
    PublishToTopicCmdProcessor,
    KafkaHttpClient,
    RootCmd,
    EnvVarProvider,
    build_persist_cmd,
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

persist_proc = PublishToTopicCmdProcessor(KafkaHttpClient(base_url=PERSIST_URL))


def persist_payload(payload: dict, cmd: RootCmd) -> int:
    enrich_payload(payload, cmd)
    persist_cmd = build_persist_cmd(payload, cmd)
    publish_to_topic_cmd = build_publish_to_topic_cmd(persist_cmd, PERSIST_TOPIC)

    persist_proc.process(publish_to_topic_cmd)
