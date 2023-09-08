from typing import Optional


class QryCondition:
    column: str
    operator: str = "="
    condition: str
    grouping_key: int = 0


class WiqlCmd:
    colums: list[str]
    table: str = "WorkItems"
    conditions: list[QryCondition]
    mode: Optional[str] = None


class WiqlCmdProcessor:
    def process(cmd: WiqlCmd) -> str:
        def build_where_clause(cmd: WiqlCmd) -> str:
            if cmd.mode == "Recursive":
                return ""
            else:
                return ""  # f'{" AND ".join([f"{c.column} {c.operator} {c.condition}" for c in cmd.conditions])}'

        qry = f"""
            SELECT {",".join(cmd.columns)}
            FROM {cmd.table}
            WHERE {build_where_clause(cmd)}
        """

        print(qry)

        return qry
