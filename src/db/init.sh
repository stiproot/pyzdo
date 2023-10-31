#!/bin/sh

/entrypoint.sh couchbase-server &

sleep 10

/opt/couchbase/init-init-cluster.sh
/opt/couchbase/init-create-bucket.sh project_m
/opt/couchbase/init-create-scope.sh project_m definitions
/opt/couchbase/init-create-scope.sh project_m azdo
/opt/couchbase/init-create-scope.sh project_m structures
/opt/couchbase/init-create-collection.sh project_m definitions projects
/opt/couchbase/init-create-collection.sh project_m definitions processes
/opt/couchbase/init-create-collection.sh project_m azdo initiatives
/opt/couchbase/init-create-collection.sh project_m azdo epics
/opt/couchbase/init-create-collection.sh project_m azdo features
/opt/couchbase/init-create-collection.sh project_m azdo user_stories
/opt/couchbase/init-create-collection.sh project_m azdo tasks
/opt/couchbase/init-create-collection.sh project_m azdo impediments
/opt/couchbase/init-create-collection.sh project_m azdo bugs
/opt/couchbase/init-create-collection.sh project_m azdo null
/opt/couchbase/init-create-collection.sh project_m structures summarized_trees
/opt/couchbase/init-create-collection.sh project_m structures weighted_trees
/opt/couchbase/indx.sh

tail -f /dev/null
