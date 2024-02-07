#!/bin/sh

CLUSTER_USERNAME="root"
CLUSTER_PASSWORD="R007__.."
COUCHBASE_URL="http://127.0.0.1:8093/query/service"

# curl -u root:R007__.. -v -X POST http://127.0.0.1:8093/query/service -d 'statement=CREATE PRIMARY INDEX ON project_m.definitions.projects'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.definitions.projects'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.definitions.processes'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.initiatives'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.epics'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.features'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.user_stories'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.tasks'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.programmes'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.medium_projects'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.impediments'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.azdo.bugs'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.structures.summarized_trees'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON project_m.structures.weighted_trees'
