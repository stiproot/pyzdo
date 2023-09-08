from pyxi_process_manager import ProcessCmd
from common.cmd_types import CmdTypes
from typing import Optional
from common.enum_functions import string_to_enum


class CoreCmd:
    cmd_type: CmdTypes
    ql: Optional[str]

    def __init__(self, cmd_type: str, ql: Optional[str]):
        self.cmd_type = string_to_enum(CmdTypes, cmd_type)
        self.ql = ql


class WorkflowCmd(ProcessCmd):
    cmd: CoreCmd
    metadata: dict

    def __init__(self, cmd: dict, metadata: dict):
        self.cmd = CoreCmd(**cmd)
        self.metadata = metadata
