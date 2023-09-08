from persist_cmd_processor import PersistCmdProcessor, PersistCmd
from json import dumps as json_dumps
from http_clients.kafka_http_client import KafkaHttpClient

persist_topic = "topic_core_persist"
persist_url = "http://localhost:8001/kafka/topic/publish"
persist_proc = PersistCmdProcessor(KafkaHttpClient(base_url=persist_url))


def persist_payload(store_metadata: dict, payload: dict) -> int:
    id = payload["id"]
    json_payload = json_dumps(
        {
            "payload": {
                "store_metadata": store_metadata,
                "payload": payload,
            },
            "topic": persist_topic,
            "key": id,
        }
    )
    persist_cmd = PersistCmd(payload=json_payload)
    persist_proc.process(persist_cmd)
