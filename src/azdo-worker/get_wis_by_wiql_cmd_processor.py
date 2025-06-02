from pyxi_process_manager import CmdProcessor
from pyxi_azdo_http_client import AzdoHttpClient, AzdoUrlBuilder
import json
import logging


class GetWisByWiqlCmd:
    query: str

    def __init__(self, query: str):
        self.query = query

    def _to_dict_(self) -> dict:
        return {"query": self.query}


class GetWisByWiqlCmdProcessor(CmdProcessor):
    def __init__(self):
        self._client = AzdoHttpClient(
            AzdoUrlBuilder(organization="Xo", project_name="XoProj")
        )

    def process(self, cmd: GetWisByWiqlCmd) -> dict:
        try:
            dic = cmd._to_dict_()
            logging.info(f"GetWisByWiqlCmdProcessor: dic: {dic}")
            wis = self._client.get_wis_with_wiql(dic)
            resp = json.loads(wis.text)
            logging.info(f"GetWisByWiqlCmdProcessor: resp: {resp}")
            return resp
        except Exception as e:
            logging.error(f"GetWisByWiqlCmdProcessor: error: {e}")
            raise e
