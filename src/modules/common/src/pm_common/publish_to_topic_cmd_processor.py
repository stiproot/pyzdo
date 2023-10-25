from pyxi_process_manager import CmdProcessor
from typing import Optional
from .publish_to_topic_cmd import PublishToTopicCmd
from .http_clients.kafka_http_client import KafkaHttpClient


class PublishToTopicCmdProcessor(CmdProcessor):
    def __init__(self, http_client: Optional[KafkaHttpClient] = KafkaHttpClient()):
        self._http_client = http_client

    def process(self, cmd: PublishToTopicCmd) -> None:
        json = cmd._serialize_()
        self._http_client.publish(json=json)
