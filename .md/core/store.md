
[pyzdo]
    [azdo]
        [initiatives]
        [epics]
        [features]
        [stories]
        [tasks]
        [bugs]
        [impediments]
    [projects]
        [
            {
                id: hdt,
                name: Help Desk Traditional,
                ownder: Anish Reddy,
                queries: [
                    {
                        id: hdt_features,
                        name: Features,
                        query: "SELECT * FROM features WHERE project_id = hdt"
                    },
                    {
                        id: hdt_stories,
                        name: Stories,
                        query: "SELECT * FROM stories WHERE project_id = hdt"
                    },
                    {
                        id: hdt_tasks,
                        name: Tasks,
                        query: "SELECT * FROM tasks WHERE project_id = hdt"
                    }
                ],
            }
        ]
    [structures]
        [summarized_trees]
            [
                {
                    id: hdt,
                    timestamp: 2020-01-01,
                    project: hdt,
                    tree: { }
                }
            ]
        [weighted_trees]
            [
                {
                    id: hdt,
                    timestamp: 2020-01-01,
                    project: hdt,
                    tree: { }
                }
            ]