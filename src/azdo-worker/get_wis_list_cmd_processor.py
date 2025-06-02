from pyxi_process_manager import CmdProcessor
from pyxi_azdo_http_client import AzdoHttpClient, AzdoUrlBuilder
import json
import logging


class GetWisListCmd:
    ids: list[int]

    def __init__(self, ids: list[int]):
        self.ids = ids


class GetWisListCmdProcessor(CmdProcessor):
    def __init__(self):
        self._client = AzdoHttpClient(
            AzdoUrlBuilder(organization="Xo", project_name="XoProj")
        )

    def process(self, cmd: GetWisListCmd) -> dict:
        try:
            resp = self._client.get_wis_list(cmd.ids)
            dic = json.loads(resp.text)
            logging.info(f"GetWisListCmdProcessor.process: resp: {dic}")
            return dic
        except Exception as e:
            logging.error(f"GetWisListCmdProcessor: error: {e}")
            raise e
