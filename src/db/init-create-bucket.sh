#!/bin/sh

/opt/couchbase/bin/couchbase-cli bucket-create \
	-c localhost \
	-u root \
	-p R007__.. \
	--bucket="$1" --bucket-type=couchbase \
	--bucket-ramsize=100 \
	--bucket-replica=1 \
	--wait
