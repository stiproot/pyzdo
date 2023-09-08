from typing import Optional
from pyxi_process_manager import CmdProcessor, ProcessCmd
from json import dumps as json_dumps
from uuid import uuid4
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from http_clients.http_client import HttpClient


class PersistProcessCmd(ProcessCmd):
    store_metadata: dict
    payload: dict

    def __init__(
        self,
        store_metadata: dict,
        payload: dict,
        idempotency_id: Optional[str] = str(uuid4()),
    ):
        super().__init__(idempotency_id)
        self.store_metadata = store_metadata
        self.payload = payload


class PersistCmdProcessor(CmdProcessor):
    def __init__(
        self,
        http_client: Optional[HttpClient] = HttpClient(),
    ):
        self._http_client = http_client

    def map_cmd_to_req(self, cmd: PersistProcessCmd) -> str:
        id = str(cmd.payload.get("id", 0))
        req = {
            "bucket_name": cmd.store_metadata["bucket_name"],
            "scope_name": cmd.store_metadata["scope_name"],
            "collection_name": cmd.store_metadata["trgt_collection"],
            "key": id,
            "payload": json_dumps(cmd.payload),
        }
        json_payload = json_dumps(req)
        print(f"json_payload: {json_payload}")
        return json_payload

    def process(self, cmd: PersistProcessCmd) -> None:
        try:
            json = self.map_cmd_to_req(cmd)
            self._http_client.post(json=json)
        except:
            print(f"Error processing command: {cmd.idempotency_id}")
            raise
        finally:
            print(f"Successfully processed command: {cmd.idempotency_id}")
