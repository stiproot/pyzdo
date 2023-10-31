from .summarize import summarize_node

severity_hash = {
    "(1) Negligible": 1,
    "(2) Minor": 3,
    "(3) Moderate": 2,
    "(4) Major": 4,
    "(5) Catastrophic": 5,
}

prop_rule_map = [
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
        "src_prop_path": "fields_Custom.SeverityOptionList",
        "trgt_prop_path": "severity",
        "type": "int",
        "path_separator": "_",
        "map": lambda x: severity_hash.get(x.strip(), 1) if x and x != "" else 1,
        "is_path": True,
        "default": "Negligible",
    },
    {
        "src_prop_path": "fields_System.WorkItemType",
        "trgt_prop_path": "type",
        "type": "string",
        "path_separator": "_",
        "map": lambda x: x.strip(),
        "is_path": True,
        "default": "",
    },
]


def dependencies_formulae(base, multiplier, tags):
    if (
        "Number_of_Dependencies_1" in tags
        or "Number_of_Dependencies_2-3" in tags
        or "Number_of_Dependencies_3+" in tags
    ):
        return base * multiplier
    return base


def team_domain_formulae(base, multiplier, tags):
    if (
        "Team_Domain_Knowledge_High" in tags
        or "Team_Domain_Knowledge_Medium" in tags
        or "Team_Domain_Knowledge_Low" in tags
    ):
        return base * multiplier
    return base


def repo_maturity_formulae(base, multiplier, tags):
    if (
        "Repo_Maturity_Copper" in tags
        or "Repo_Maturity_Bronze" in tags
        or "Repo_Maturity_Copper" in tags
        or "Repo_Maturity_Silver" in tags
        or "Repo_Maturity_Electrum" in tags
        or "Repo_Maturity_Gold" in tags
    ):
        return base * multiplier
    return base


okr_fn = (
    lambda base, multiplier, **kwargs: base * multiplier
    if "OKR_Yes" in kwargs["tags"]
    else base
)
audacious_fn = (
    lambda base, multiplier, **kwargs: base * multiplier
    if "Audacious_Goal_Yes" in kwargs["tags"]
    else base
)
hard_date_fn = (
    lambda base, multiplier, **kwargs: base * multiplier
    if "Hard_Delivery_date_Yes" in kwargs["tags"]
    else base
)
no_dependencies_fn = lambda base, multiplier, **kwargs: dependencies_formulae(
    base, multiplier, **kwargs
)
team_domain_fn = lambda base, multiplier, **kwargs: team_domain_formulae(
    base, multiplier, **kwargs
)
individual_domain_fn = (
    lambda base, multiplier, **kwargs: base * multiplier
    if "Individual_Yes" in kwargs["tags"]
    else base
)
repo_maturity_fn = lambda base, multiplier, **kwargs: repo_maturity_formulae(
    base, multiplier, **kwargs
)
feature_hash = [
    {
        "feature_id": "contributes_to_okr",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "binary",
        "feature_weighting_multiplier": 2,
        "formula": okr_fn,
    },
    {
        "feature_id": "audacious_goal",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "binary",
        "feature_weighting_multiplier": 2,
        "formula": audacious_fn,
    },
    {
        "feature_id": "hard_delivery_date",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "binary",
        "feature_weighting_multiplier": 2,
        "formula": hard_date_fn,
    },
    {
        "feature_id": "no_dependencies",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "set",
        "feature_weighting_multiplier": 2,
        "formula": no_dependencies_fn,
    },
    {
        "feature_id": "team_domain",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "set",
        "feature_weighting_multiplier": 2,
        "formula": team_domain_fn,
    },
    {
        "feature_id": "individual_domain",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "binary",
        "feature_weighting_multiplier": 2,
        "formula": individual_domain_fn,
    },
    {
        "feature_id": "repo_maturity",
        "arg_props": ["tags"],
        "base_prop": "severity",
        "feature_data_type": "set",
        "feature_weighting_multiplier": 2,
        "formula": repo_maturity_fn,
    },
]


def weigh_summary(summary: dict):
    weight = 0
    for feature in feature_hash:
        feature_weighting_multiplier = feature["feature_weighting_multiplier"]
        base_prop = feature["base_prop"]
        arg_props = feature["arg_props"]
        formula = feature["formula"]

        arg_dict = {}
        for p in arg_props:
            arg_dict[p] = summary[p]

        output = formula(
            base=summary[base_prop], multiplier=feature_weighting_multiplier, **arg_dict
        )
        weight += output

    summary["risk_weight"] = weight


def enrich_summary_tree(summary: dict) -> None:
    if summary["type"] == "Task":
        weigh_summary(summary)
    else:
        for child in summary["children"]:
            enrich_summary_tree(child)


def build_risk_weighted_work_item_tree(
    node_id: int, node_type: str, get_raw_node_fn
) -> dict:
    node = get_raw_node_fn(node_id, node_type)
    summary = summarize_node(
        node, prop_rule_map=prop_rule_map, get_raw_node_fn=get_raw_node_fn
    )
    enrich_summary_tree(summary)
    return summary
