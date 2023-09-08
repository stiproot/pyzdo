#!/bin/sh

/opt/couchbase/bin/couchbase-cli collection-manage \
	-c localhost \
	-u root \
	-p R007__.. \
	--bucket="$1" \
	--create-scope "$2"
