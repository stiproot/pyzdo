#!/bin/sh

# /opt/couchbase/bin/couchbase-cli cluster-init \
# 	-c localhost \
# 	--cluster-username root \
# 	--cluster-password R007__.. \
# 	--services data,index,query \
# 	--cluster-ramsize 4096 \
# 	--cluster-index-ramsize 1024 \
# 	--index-storage-setting memopt

CLUSTER_USERNAME="root"
CLUSTER_PASSWORD="R007__.."
CLUSTER_RAMSIZE=4096
CLUSTER_INDEX_RAMSIZE=1024

LOG_FILE="/var/log/init_couchbase.log"

log_message() {
	local message="$1"
	echo "$(date +'%Y-%m-%d %H:%M:%S') - $message" >>"$LOG_FILE"
}

log_message "Initializing Couchbase cluster..."
/opt/couchbase/bin/couchbase-cli cluster-init \
	-c 127.0.0.1 \
	--cluster-username "$CLUSTER_USERNAME" \
	--cluster-password "$CLUSTER_PASSWORD" \
	--services data,index,query \
	--cluster-ramsize "$CLUSTER_RAMSIZE" \
	--cluster-index-ramsize "$CLUSTER_INDEX_RAMSIZE" \
	--index-storage-setting memopt

if [ $? -eq 0 ]; then
	log_message "Couchbase cluster initialized successfully."
else
	log_message "Failed to initialize Couchbase cluster. Check the script and Couchbase setup."
fi
