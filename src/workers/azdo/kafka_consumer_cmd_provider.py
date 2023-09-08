from typing import Optional
from pyxi_process_manager.cmd_provider import CmdProvider
from pyxi_process_manager.process_cmd import ProcessCmd
from pyxi_kafka_client import KafkaConsumerManager
from json import loads as json_loads
from gather_project_units_of_work_workflow import WorkflowCmd


class KafkaConsumerCmdProvider(CmdProvider):
    def __init__(
        self,
        consumer_group_id: str,
        topic: str,
        consumer_configuration: Optional[dict[str, str]] = {
            "bootstrap.servers": "localhost:9092"
        },
    ):
        self._kafka_consumer_manager = (
            KafkaConsumerManager(topic=topic, consumer_group_id=consumer_group_id)
            .init(consumer_configuration)
            .subscribe()
        )

    def provide(self) -> [ProcessCmd]:
        msg = self._kafka_consumer_manager.poll()
        if msg is None:
            return []

        msg_value = msg.value()
        decoded_msg_value = msg_value.decode("utf-8")
        structured_msg_data = json_loads(decoded_msg_value)

        obj = WorkflowCmd(**structured_msg_data)

        return [obj]
