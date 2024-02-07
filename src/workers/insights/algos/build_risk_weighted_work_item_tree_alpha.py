from .summarize import summarize_node
from .prop_rule_mappings import PROP_RULE_MAP
from .critical_tags_alpha import CRITICAL_TAGS
from .enrichers import enrich_with_perc_complete


def is_critical(summary: dict) -> bool:
    return any(tag in CRITICAL_TAGS for tag in summary["tags"])


def calc_risk_impact(summary: dict):
    return int(summary["risk_weighting"]) * int(summary["severity"])


def calc_rag_status(risk_impact: int) -> str:
    if risk_impact < 15:
        return "Green"
    elif risk_impact >= 15 and risk_impact < 39:
        return "Amber"
    else:
        return "Red"


def enrich_summary_tree(summary: dict) -> None:
    summary[
        "ext_url"
    ] = f'https://dev.azure.com/Derivco/Software/_workitems/edit/{summary["id"]}'

    if summary["type"] == "Task":
        risk_impact = calc_risk_impact(summary)
        summary["risk_impact"] = risk_impact
        summary["rag_status"] = calc_rag_status(risk_impact)
        summary["is_critical"] = is_critical(summary)
    else:
        for child in summary["children"]:
            enrich_summary_tree(child)


def build_risk_weighted_work_item_tree(
    node_id: int, node_type: str, get_raw_node_fn
) -> dict:
    node = get_raw_node_fn(node_id, node_type)
    summary = summarize_node(
        node, prop_rule_map=PROP_RULE_MAP, get_raw_node_fn=get_raw_node_fn
    )
    enrich_summary_tree(summary)
    enrich_with_perc_complete(summary)
    return summary
