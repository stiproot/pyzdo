from pyxi_process_manager import ProcessCmd
from persist_cmd_processor import PersistCmdProcessor, PersistCmd
from get_wi_details_cmd_processor import GetWiDetailsCmdProcessor, GetWiDetailsCmd
from get_wis_by_wiql_cmd_processor import GetWisByWiqlCmdProcessor, GetWisByWiqlCmd
from json import dumps as json_dumps
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from http_clients.kafka_http_client import KafkaHttpClient
from common.cmd_types import CmdTypes
from common.enum_functions import string_to_enum


persist_topic = "topic_projectm_cmd_persist"
persist_url = "http://localhost:8001/kafka/topic/publish"

wi_by_wiql_proc = GetWisByWiqlCmdProcessor()
wi_details_proc = GetWiDetailsCmdProcessor()
persist_proc = PersistCmdProcessor(KafkaHttpClient(base_url=persist_url))


class CoreCmd:
    cmd_type: CmdTypes
    ql: str

    def __init__(self, cmd_type: str, ql: str):
        self.cmd_type = string_to_enum(CmdTypes, cmd_type)
        self.ql = ql


class WorkflowCmd(ProcessCmd):
    cmd: CoreCmd
    metadata: dict

    def __init__(self, cmd: dict, metadata: dict):
        self.cmd = CoreCmd(**cmd)
        self.metadata = metadata


def gather_project_units_of_work_workflow(cmd: WorkflowCmd) -> int:
    ql = cmd.cmd.ql
    get_by_wiql_cmd = GetWisByWiqlCmd(query=ql)

    wis_resp = wi_by_wiql_proc.process(get_by_wiql_cmd)
    wis = list(wis_resp["workItems"])
    if len(wis) == 0:
        return 1

    details = []
    for wi in wis:
        id = int(wi["id"])
        get_details_cmd = GetWiDetailsCmd(id=id)
        details_resp = wi_details_proc.process(get_details_cmd)
        details.append(details_resp)

    for wi in details:
        id = str(wi["id"])
        payload = json_dumps(
            {
                "payload": {
                    "store_metadata": cmd.metadata["store"],
                    "payload": wi,
                },
                "topic": persist_topic,
                "key": id,
            }
        )
        persist_cmd = PersistCmd(payload=payload)
        persist_proc.process(persist_cmd)
