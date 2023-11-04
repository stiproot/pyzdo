from .raw_inspectors import (
    get_relation_type_from_relation_structure,
    get_id_from_relation_structure,
)
from pm_common import get_nested_property, get_nested_property_with_default
import logging

logging.basicConfig(level=logging.DEBUG)


def summarize_node(raw_node: dict, prop_rule_map: list, get_raw_node_fn) -> dict:
    summary = {}

    if not raw_node:
        return summary

    risk_weighting_defaulted = False
    severity_defaulted = False

    for prop in prop_rule_map:
        value = None
        defaulted = False
        if prop["is_path"]:
            # value = get_nested_property(
            #     data=raw_node,
            #     keys=prop["src_prop_path"],
            #     delimiter=prop["path_separator"],
            #     default=prop["default"],
            # )
            value, _defaulted = get_nested_property_with_default(
                data=raw_node,
                keys=prop["src_prop_path"],
                delimiter=prop["path_separator"],
                default=prop["default"],
            )
            defaulted = _defaulted
            if _defaulted:
                logging.debug(
                    f"Defaulting {prop['src_prop_path']} to {prop['default']}. Node id: {raw_node['id']}"
                )
        else:
            value = raw_node[prop["src_prop_path"]]
            if value is None:
                value = prop["default"]
                logging.debug(
                    f"Defaulting {prop['src_prop_path']} to {prop['default']}. Node id: {raw_node['id']}"
                )

                defaulted = True

        if value is None:
            raise Exception("Invalid path")

        value = value if prop["map"] is None else prop["map"](value)
        summary[prop["trgt_prop_path"]] = value

        if prop["trgt_prop_path"] == "risk_weighting":
            risk_weighting_defaulted = defaulted

        if prop["trgt_prop_path"] == "severity":
            severity_defaulted = defaulted

    summary["defaulted"] = risk_weighting_defaulted or severity_defaulted

    raw_relations = raw_node.get("relations", None)
    if raw_relations is None:
        logging.debug(f"No relations for {raw_node['id']}")
        logging.debug(f"Raw node: {raw_node}")
        raise Exception("No relations")

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
            unit_of_work_type = summary["type"]
            if unit_of_work_type == "Initiative":
                child_type = "epics"
            elif unit_of_work_type == "Epic":
                child_type = "features"
            elif unit_of_work_type == "Feature":
                child_type = "user_stories"
            else:
                child_type = "tasks"

            raw_child_node = get_raw_node_fn(relation_id, child_type)
            if not raw_child_node:
                logging.debug(f"Could not find child node. Node id: {relation_id}")
                continue

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
