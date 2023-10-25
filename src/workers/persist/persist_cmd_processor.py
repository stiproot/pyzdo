from pyxi_process_manager import CmdProcessor
from json import dumps as json_dumps
from pm_common import HttpClient, RootCmd


class PersistCmdProcessor(CmdProcessor):
    def __init__(self, http_client: HttpClient):
        self._http_client = http_client

    def map_cmd_to_req(self, cmd: RootCmd) -> str:
        id = str(cmd.cmd_data.get("id", 0))
        store = cmd._cmd_post_op_store_()

        payload = json_dumps(cmd.cmd_data)

        req = {
            "bucket_name": store["trgt_bucket"],
            "scope_name": store["trgt_scope"],
            "collection_name": store["trgt_collection"],
            "key": id,
            "payload": payload,
        }

        json_payload = json_dumps(req)
        return json_payload

    def process(self, cmd: RootCmd) -> None:
        try:
            json = self.map_cmd_to_req(cmd)
            print(f"Sending command to persist: {json}")
            self._http_client.post(json=json)
        except:
            print(f"Error processing command: {cmd._serialize_()}")
            raise
        finally:
            print(f"Successfully processed command: {cmd._serialize_()}")
