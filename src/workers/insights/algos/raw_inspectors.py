import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from common.cmd_types import CmdTypes
from common.dict_functions import get_nested_property


def get_id_from_relation_structure(relation: dict) -> int:
    return int(relation["url"].split("/")[-1])


def get_relation_type_from_relation_structure(relation: dict) -> str:
    return relation["attributes"]["name"].lower()
