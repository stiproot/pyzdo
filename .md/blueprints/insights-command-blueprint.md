# Gather data
```json
{
    "topic": "topic_projectm_cmd_insights_gather",
    "key": "2",
    "payload": {
        "cmd": {
            "cmd_type": "GATHER_PROJECT_UNITS_OF_WORK",
            "ql": "SELECT [System.Title] FROM WorkItems WHERE [System.TeamProject] = 'Software' AND [System.WorkItemType] = 'User Story' AND [System.Tags] CONTAINS 'Feature' AND [System.Tags] CONTAINS 'ProjectTemplate' ORDER BY [System.Title]"
        },
        "metadata": {
            "project": {
                "project_id": "project_x",
                "project_name": "Project X",
            },
            "store": {
                "store_type": "couchbase",
                "bucket_name": "PROJECTX",
                "scope_name": "AZDO",
                "trgt_collection": "USER_STORY"
            }
        }
    }
}
```

# Structure data
```json
{
    "topic": "topic_projectm_cmd_insights_structure",
    "key": "10",
    "payload": {
        "cmd": {
            "cmd_type": "BUILD_WORK_ITEM_TREE",
            "ql": null
        },
        "metadata": {
            "project": {
                "project_id": "project_x",
                "project_name": "Project X",
            },
            "store": {
                "store_type": "couchbase",
                "bucket_name": "PROJECTX",
                "scope_name": "AZDO",
                "root_collection": "FEATURE",
                "trgt_collection": "TREE"
            }
        }
    }
}
```