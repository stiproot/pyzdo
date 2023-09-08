from typing import Optional
from pyxi_process_manager import CmdProcessor, ProcessCmd
from pyxi_azdo_http_client import AzdoHttpClient, AzdoUrlBuilder
from wiql_cmd_processor import WiqlCmdProcessor, WiqlCmd
import json


class GetWisByWiqlCmd(ProcessCmd):
    query: Optional[str] = None
    wiql_cmd: Optional[WiqlCmd] = None

    def __init__(self, query: Optional[str] = None, wiql_cmd: Optional[WiqlCmd] = None):
        self.query = query
        self.wiql_cmd = wiql_cmd


class GetWisByWiqlCmdProcessor(CmdProcessor):
    def __init__(self):
        self._wiql_cmd_processor = WiqlCmdProcessor()
        self._client = AzdoHttpClient(
            AzdoUrlBuilder(organization="Derivco", project_name="Software")
        )

    def process(self, cmd: GetWisByWiqlCmd) -> dict:
        if cmd.query is None and cmd.wiql_cmd is None:
            raise Exception("Invalid operation.")

        if cmd.query is None:
            cmd.query = self._wiql_cmd_processor.process(cmd.wiql_cmd)

        wis = self._client.get_wis_with_wiql({"query": cmd.query})

        resp = json.loads(wis.text)

        return resp
