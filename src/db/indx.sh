#!/bin/sh

CLUSTER_USERNAME="root"
CLUSTER_PASSWORD="R007__.."
COUCHBASE_URL="http://127.0.0.1:8093/query/service"

# curl -u root:R007__.. -v -X POST http://127.0.0.1:8093/query/service -d 'statement=CREATE PRIMARY INDEX ON pyzdo.definitions.projects'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.definitions.projects'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.definitions.processes'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.initiatives'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.epics'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.features'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.user_stories'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.tasks'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.programmes'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.medium_projects'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.impediments'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.azdo.bugs'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.structures.summarized_trees'

curl -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" -v -X POST "$COUCHBASE_URL" \
	-d 'statement=CREATE PRIMARY INDEX ON pyzdo.structures.weighted_trees'
