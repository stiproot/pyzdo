from typing import Optional
from pyxi_process_manager import CmdProcessor, ProcessCmd
from uuid import uuid4
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from http_clients.kafka_http_client import KafkaHttpClient


class PersistCmd(ProcessCmd):
    payload: str

    def __init__(
        self,
        payload: str,
        idempotency_id: Optional[str] = str(uuid4()),
    ):
        super().__init__(idempotency_id)
        self.payload = payload


class PersistCmdProcessor(CmdProcessor):
    def __init__(
        self,
        http_client: Optional[KafkaHttpClient] = KafkaHttpClient(),
    ):
        self._http_client = http_client

    def process(self, cmd: PersistCmd) -> None:
        self._http_client.publish(json=cmd.payload)
