from pyxi_process_manager.cmd_provider import CmdProvider
from .kafka.kafka_consumer_manager import KafkaConsumerManager
from json import loads as json_loads
from .root_cmd import RootCmd
import logging

logging.basicConfig(level=logging.DEBUG)


class KafkaConsumerRootCmdProvider(CmdProvider):
    def __init__(self, topic: str):
        self._topic = topic
        self._kafka_consumer_manager = KafkaConsumerManager(topic=topic)
        logging.info(
            f"KafkaConsumerRootCmdProvider.__init__: KafkaConsumerManager initialized. topic: {topic}",
        )

    def provide(self) -> [RootCmd]:
        try:
            msg = self._kafka_consumer_manager.poll()
            if msg is None:
                return []

            msg_value = msg.value()
            decoded_msg_value = msg_value.decode("utf-8")

            # logging.info(
            #     f"KafkaConsumerRootCmdProvider.provide: decoded message value: {decoded_msg_value}"
            # )

            structured_msg_data = json_loads(decoded_msg_value)
            obj = RootCmd(**structured_msg_data)
            return [obj]

        except Exception as e:
            logging.error("KafkaConsumerRootCmdProvider.provide: Error", e)
            return []
