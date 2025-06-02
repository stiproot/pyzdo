from pyxi_process_manager import RootProcessCmd
from .cmd_categories import CmdCategories
from .cmd_types import CmdTypes
from .enum_functions import string_to_enum
from json import dumps as json_dumps


class RootCmd(RootProcessCmd):
    def __init__(
        self,
        cmd_category: CmdCategories,
        cmd_type: CmdTypes,
        cmd_data: dict,
        cmd_metadata: dict,
    ):
        super().__init__(cmd_data, cmd_metadata)
        self.cmd_category = string_to_enum(CmdCategories, cmd_category)
        self.cmd_type = string_to_enum(CmdTypes, cmd_type)

    def _to_dict_(self) -> dict:
        return {
            "cmd_category": self.cmd_category.value,
            "cmd_type": self.cmd_type.value,
            "cmd_data": self.cmd_data,
            "cmd_metadata": self.cmd_metadata,
        }

    def _serialize_(self) -> str:
        return json_dumps(self._to_dict_())
