**Kafka API**
- Publish messages to a Kafka topic
- Provide configuration for registering a consumer to a topic

**Cuchbase API**
- Endpoint for querying data in Couchbase
- Endpoint for persisting data to Couchbase

**Persist Worker**
- Consume messages off a dedicated 'persist' topic
- Persist data through the Couchbase API

**Insights Worker**
- Consume messages off a dedicated 'insights' command topic
- Process insights
- Persist data through the Couchbase API

**Chron Worker**
- Read job procesing configuration
- Chronologically perform a collection of jobs