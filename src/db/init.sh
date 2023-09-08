#!/bin/sh

/opt/couchbase/init-init-cluster.sh
/opt/couchbase/init-create-bucket.sh project_x
/opt/couchbase/init-create-scope.sh project_x azdo
/opt/couchbase/init-create-collection.sh project_x azdo features
/opt/couchbase/init-create-collection.sh project_x azdo user_stories
/opt/couchbase/init-create-collection.sh project_x azdo tasks
/opt/couchbase/init-create-collection.sh project_x azdo structured_trees
