from .summarize import summarize_node

field_map = [
    {
        "src_prop_path": "id",
        "trgt_prop_path": "id",
        "type": "int",
        "path_separator": None,
        "map": None,
        "is_path": False,
        "default": "",
    },
    {
        "src_prop_path": "fields_Custom.IsBlocked",
        "trgt_prop_path": "is_blocked",
        "type": "bool",
        "path_separator": "_",
        "map": None,
        "is_path": True,
        "default": False,
    },
    {
        "src_prop_path": "fields_Microsoft.VSTS.Scheduling.OriginalEstimate",
        "trgt_prop_path": "original_estimate",
        "type": "int",
        "path_separator": "_",
        "map": None,
        "is_path": True,
        "default": "0",
    },
    {
        "src_prop_path": "fields_Microsoft.VSTS.Scheduling.CompletedWork",
        "trgt_prop_path": "completed_work",
        "type": "int",
        "path_separator": "_",
        "map": None,
        "is_path": True,
        "default": "0",
    },
    {
        "src_prop_path": "fields_Microsoft.VSTS.Scheduling.RemainingWork",
        "trgt_prop_path": "remaining_work",
        "type": "int",
        "path_separator": "_",
        "map": None,
        "is_path": True,
        "default": "0",
    },
    {
        "src_prop_path": "fields_System.Title",
        "trgt_prop_path": "title",
        "type": "string",
        "path_separator": "_",
        "map": lambda x: x.strip(),
        "is_path": True,
        "default": "",
    },
    {
        "src_prop_path": "fields_System.Tags",
        "trgt_prop_path": "tags",
        "type": "array",
        "path_separator": "_",
        "map": lambda x: list(map(lambda t: t.strip(), x.split(";"))),
        "is_path": True,
        "default": "",
    },
    {
        "src_prop_path": "fields_System.State",
        "trgt_prop_path": "state",
        "type": "string",
        "path_separator": "_",
        "map": None,
        "is_path": True,
        "default": "",
    },
    {
        "src_prop_path": "fields_System.WorkItemType",
        "trgt_prop_path": "type",
        "type": "string",
        "path_separator": "_",
        "map": None,
        "is_path": True,
        "default": "",
    },
]


def build_summarized_work_item_tree(
    node_id: int, node_type: str, get_raw_node_fn
) -> dict:
    node = get_raw_node_fn(node_id=node_id, node_type=node_type)
    summary = summarize_node(
        raw_node=node, prop_rule_map=field_map, get_raw_node_fn=get_raw_node_fn
    )
    return summary
