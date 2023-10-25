from typing import Optional
from confluent_kafka import Consumer
from pm_common.utils.env_var_provider import EnvVarProvider

import logging


class ConsumerConfigurationBuilder:
    def __init__(self):
        self._env = EnvVarProvider()

    def build(self) -> dict[str, str]:
        config = {
            "bootstrap.servers": self._env.get_env_var("BOOTSTRAP_SERVERS"),
            "group.id": self._env.get_env_var("GROUP_ID"),
            "auto.offset.reset": "earliest",
            "enable.auto.commit": True,
            "api.version.request": True,
            "api.version.fallback.ms": 0,
        }
        logging.info(f"ConsumerConfigurationBuilder.build: {config}")
        return config


class KafkaConsumerManager:
    def __init__(self, topic: str):
        config = ConsumerConfigurationBuilder().build()
        consumer = Consumer(config)
        self._consumer = consumer
        self._consumer.subscribe([topic])

    def poll(self, timeout: Optional[int] = 1.0):
        try:
            return self._consumer.poll(timeout)
        except Exception as e:
            logging.error(f"KafkaConsumerManager.poll: Error {e}")
            raise

    def dispose(self):
        logging.info("KafkaConsumerManager.dispose: closing consumer")
        self._consumer.close()
        return self
