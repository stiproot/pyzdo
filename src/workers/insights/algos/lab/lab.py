fn = lambda base, multiplier, **kargs: base * multiplier + kargs["a"]

property_map = [
    {
        "src_prop_path": "fields_System.Tags",
        "trgt_prop_path": "tags",
        "type": "array",
        "path_separator": "_",
        "map": lambda x: x.split(";"),
        "is_path": True,
    },
    {
        "src_prop_path": "fields_System.State",
        "trgt_prop_path": "state",
        "type": "string",
        "path_separator": "_",
        "map": None,
        "is_path": True,
    },
    {
        "src_prop_path": "fields_Custom.SeverityOptionList",
        "trgt_prop_path": "severity",
        "type": "string",
        "path_separator": "_",
        "map": None,
        "is_path": True,
    },
]


def dependencies_formulae(base, multiplier, tags):
    print("dependencies_formulae: ", "tags", tags)

    if (
        "Number_of_Dependencies_1" in tags
        or "Number_of_Dependencies_2-3" in tags
        or "Number_of_Dependencies_3+" in tags
    ):
        print("dependencies_formulae: ", "base", base, "multiplier", multiplier)
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


def build_risk_formula_fns(summary: dict):
    risk = 0
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
        print("output: ", output)
        risk += output
    summary["risk"] = risk


def main():
    o = {"tags": ["Number_of_Dependencies_1", "OKR_Yes"], "severity": 5}
    build_risk_formula_fns(o)
    print(o)

    # print(fn(2, 3, a=100, b=200, c=300))


if __name__ == "__main__":
    main()
