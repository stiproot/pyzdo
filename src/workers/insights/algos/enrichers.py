
def enrich_with_ext_url(node: dict) -> None:
    node["ext_url"] = f'https://dev.azure.com/Derivco/Software/_workitems/edit/{node["id"]}'


def enrich_with_perc_complete(node: dict) -> None:

    children = node.get("children", [])
    no_of_children = len(children)

    if no_of_children == 0:
        node["perc_complete"] = 100 if node["state"] == "Closed" else 0
    else:
        numerator = 0
        denominator = no_of_children * 100

        for child in children:
            enrich_with_perc_complete(child)

            if child.get("perc_complete", None) is not None:
                numerator += child["perc_complete"]

        node["perc_complete"] = round(numerator / denominator * 100, 2)


def enrich_tree_recurs(summary: dict) -> None:
    enrich_with_ext_url(summary)
    for child in summary["children"]:
        enrich_tree_recurs(child)
