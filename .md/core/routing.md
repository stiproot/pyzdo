# routing-service

    - route cmds to appropriate sub-systems

**formats**
**PERSIST**

```
{
    "topic": "<<topic-name>>",
    "key": "<<key>>",
    "payload": { }
}
```

**CMD**

```
{
    "cmd_category": <<cmd-category>>,
    "cmd_type": <<cmd-id>>,
    "cmd_data": { },
    "cmd_metadata": {
        "idempotency_id": <<guid>>,
        "project_id": <<proj-id>>,
        "cmd_post_op": {
            "enrichment": {
                "add_property_map": [
                    {
                        "key": "project_id", "val": "hdt"
                    }
                ]
            }
        }
    },
}

```

**cmd examples**
**GATHER_PROJECT_UNITS_OF_WORK**

```
{
    "cmd_category": "GATHER",
    "cmd_type": "GATHER_PROJECT_UNITS_OF_WORK",
    "cmd_data": {
        "ql": "SELECT [System.Id],[System.WorkItemType],[System.Title],[System.AssignedTo],[System.State],[System.Tags] FROM WorkItems WHERE [System.TeamProject] = 'XoProj' AND [System.WorkItemType] = 'Epic' AND [System.Tags] CONTAINS 'N2CP-IS-HelpDesk' AND [System.Tags] CONTAINS 'ProjectTemplate' AND [System.Tags] CONTAINS 'ProjectMetricsPilot'"
    },
    "cmd_metadata": {
        "idempotency_id": <<guid>>,
        "attributes": {
            "project_id": "hdt"
        },
        "store": {
            "bucket_name": "pyzdo",
            "scope_name": "azdo",
            "trgt_collection": "epics"
        }
    }
}
```

**BUILD_SUMMARIZED_UNIT_OF_WORK_TREE**

```
{
    "cmd_category": "STRUCTURE",
    "cmd_type": "BUILD_SUMMARIZED_UNIT_OF_WORK_TREE",
    "cmd_data": {
        "ql": null
    },
    "cmd_metadata": {
        "attributes": {
            "project_id": "hdt"
        },
        "store": {
            "bucket_name": "pyzdo",
            "root_collection": "epics",
            "scope_name": "structures",
            "trgt_collection": "summarized_trees"
        }
    }
}
```

**CLONE_UNIT_OF_WORK**

```
{
    "cmd_category": "EXT",
    "cmd_type": "CLONE_UNIT_OF_WORK",
    "cmd_data": {
        "cmd": {
            "cmd": {
                "id": 1116048,
                "parentId": 1101238,
                "iterationName": "Sprint 13 2023",
                "iterationBasePath": "XoProj\\Non-Aligned\\Customers and Emerging Markets\\Teams\\N2 Chapmans Peak Project Team\\2023",
                "teamName": "CEM - N2 Chapmans Peak Project Team",
                "areaPath": "XoProj\\Customers and Emerging Markets\\Rapid Response\\Project\\N2 Chapmans Peak Project Team",
                "tags": "pyzdo_demo_0"
            }
        }
    },
    "cmd_metadata": {
        "attributes": {
            "project_id": "hdt"
        },
        "process": {
            "process_id": "clone"
        }
    }
}
```
