#!/bin/sh

/entrypoint.sh couchbase-server &

sleep 10

/opt/couchbase/init-init-cluster.sh
/opt/couchbase/init-create-bucket.sh pyzdo
/opt/couchbase/init-create-scope.sh pyzdo definitions
/opt/couchbase/init-create-scope.sh pyzdo azdo
/opt/couchbase/init-create-scope.sh pyzdo structures
/opt/couchbase/init-create-collection.sh pyzdo definitions projects
/opt/couchbase/init-create-collection.sh pyzdo definitions processes
/opt/couchbase/init-create-collection.sh pyzdo azdo initiatives
/opt/couchbase/init-create-collection.sh pyzdo azdo epics
/opt/couchbase/init-create-collection.sh pyzdo azdo features
/opt/couchbase/init-create-collection.sh pyzdo azdo user_stories
/opt/couchbase/init-create-collection.sh pyzdo azdo tasks
/opt/couchbase/init-create-collection.sh pyzdo azdo impediments
/opt/couchbase/init-create-collection.sh pyzdo azdo bugs
/opt/couchbase/init-create-collection.sh pyzdo azdo programmes
/opt/couchbase/init-create-collection.sh pyzdo azdo medium_projects
/opt/couchbase/init-create-collection.sh pyzdo azdo null
/opt/couchbase/init-create-collection.sh pyzdo structures summarized_trees
/opt/couchbase/init-create-collection.sh pyzdo structures weighted_trees
/opt/couchbase/indx.sh

tail -f /dev/null
