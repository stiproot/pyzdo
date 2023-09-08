from .raw_inspectors import (
    get_relation_type_from_relation_structure,
    get_id_from_relation_structure,
    get_nested_property,
)


def summarize_node(raw_node: dict, prop_rule_map: list, get_raw_node_fn) -> dict:
    summary = {}

    if not raw_node:
        return summary

    for prop in prop_rule_map:
        value = None
        if prop["is_path"]:
            value = get_nested_property(
                data=raw_node,
                keys=prop["src_prop_path"],
                delimiter=prop["path_separator"],
                default=prop["default"],
            )
        else:
            value = raw_node[prop["src_prop_path"]]

        if value is None:
            raise Exception("Invalid path")

        value = value if prop["map"] is None else prop["map"](value)
        summary[prop["trgt_prop_path"]] = value

    relations = list(
        filter(
            lambda x: x["rel"]
            in [
                "System.LinkTypes.Hierarchy-Forward",
                "System.LinkTypes.Hierarchy-Reverse",
            ],
            raw_node["relations"],
        )
    )

    if len(relations) == 0:
        return summary

    parent_id = -1
    summarized_children = []

    for relation in relations:
        relation_id = get_id_from_relation_structure(relation)
        relation_type = get_relation_type_from_relation_structure(relation)

        if relation_type == "parent":
            parent_id = relation_id

        if relation_type == "child":
            child_type = ""
            if summary["type"] == "Feature":
                child_type = "user_stories"
            else:
                child_type = "tasks"

            raw_child_node = get_raw_node_fn(relation_id, child_type)
            child_summary = summarize_node(
                raw_child_node,
                prop_rule_map=prop_rule_map,
                get_raw_node_fn=get_raw_node_fn,
            )
            if child_summary:
                summarized_children.append(child_summary)

    summary["parent_id"] = parent_id
    summary["children"] = summarized_children

    return summary
