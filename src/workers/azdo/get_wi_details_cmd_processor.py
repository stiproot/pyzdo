from pyxi_process_manager import CmdProcessor
from pyxi_azdo_http_client import AzdoHttpClient, AzdoUrlBuilder
import json
import logging


class GetWiDetailsCmd:
    id: int

    def __init__(self, id: int):
        self.id = id


class GetWiDetailsCmdProcessor(CmdProcessor):
    def __init__(self):
        self._client = AzdoHttpClient(
            AzdoUrlBuilder(organization="Derivco", project_name="Software")
        )

    def process(self, cmd: GetWiDetailsCmd) -> dict:
        try:
            resp = self._client.get_workitem_detail(work_item_id=cmd.id)
            payload = json.loads(resp.text)
            return payload
        except Exception as e:
            logging.error(f"GetWiDetailsCmdProcessor: error: {e}")
            raise e
