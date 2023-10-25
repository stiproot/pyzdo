# Project
- A project is composed of units of work
- Units of work are grouped into categories
- A project is composed of categories
- Categories are completed in a sequence
- A project is defined by a collection of queries, for its units of work
- Units of work have features
- A risk weighting for a unit of work can be calculated based on its features

# Insights
- Queries are a means to extract insights
- Queries run against structured data sources
- Commands are a means to persist data
- Commands are a means to structure data

# Structures

## Tree
```json
[
    {
        "id": int,
        "parent_id": int?,
        "type": string,
        "state": string,
        "tags": [],
        "metadata": {
            "fields": [],
            "history": [],
        },
        "children": [

        ]
    }
]
```

__Algorithm__

1. get root node
2. loop through children recursively






