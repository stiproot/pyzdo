#!/bin/sh

/opt/couchbase/bin/couchbase-cli cluster-init \
	-c 127.0.0.1 \
	--cluster-username root \
	--cluster-password R007__.. \
	--services data,index,query \
	--cluster-ramsize 4096 \
	--cluster-index-ramsize 1024 \
	--index-storage-setting memopt
