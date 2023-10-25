#!/bin/sh

sleep 60

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

# Define the Couchbase REST API URL
COUCHBASE_URL="http://127.0.0.1:8091/clusterInit"

# curl -X POST http://localhost:8091/clusterInit
#   -d hostname=localhost
#   -d username=<username>
#   -d password=<password>
#   -d data_path=<data-path>
#   -d index_path=<index-path>
#   -d cbas_path=<analytics-path>
#   -d eventing_path=<eventing-path>
#   -d java_home=<jre-path>
#   -d sendStats=true
#   -d clusterName=<cluster-name>
#   -d services=<list-of-service-names>
#   -d memoryQuota=<integer>
#   -d indexMemoryQuota=1024
#   -d eventingMemoryQuota=<integer>
#   -d ftsMemoryQuota=<integer>
#   -d cbasMemoryQuota=<integer>
#   # -d afamily=[ 'ipv4' | 'ipv6' ]
#   -d afamilyOnly=[ true | false ]
#   -d nodeEncryption='off'
#   -d indexerStorageMode='plasma'
#   -d port='SAME'
#   #-d allowedHosts=<list-of-naming-conventions>

curl -v -X POST -u "$CLUSTER_USERNAME:$CLUSTER_PASSWORD" "$COUCHBASE_URL" \
	-d 'memoryQuota='"$CLUSTER_RAMSIZE" \
	-d 'indexMemoryQuota='"$CLUSTER_INDEX_RAMSIZE" \
	-d 'services=kv,index,n1ql' \
	-d 'username=root' \
	-d 'password=R007__..' \
	-d port='SAME'

# -d 'services=data,index,query' \
# -d 'indexStorageMode=plasma' \

if [ $? -eq 0 ]; then
	log_message "Couchbase cluster initialized successfully."
else
	log_message "Failed to initialize Couchbase cluster. Check the script and Couchbase setup."
fi
