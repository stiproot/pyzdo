**UI**
- Define a project:
    - Name
    - Description
    - Unit of work queries
    - Color
    - Worker configuration
        - How often should queries run?
        - What structures need to be built?

- AzDO integration:
    - Test project queries against AzDO API
    - Import project queries from AzDO API
    - Create project dashboard

- View project insights:
    - Nested treemap

**AzDO Proxy API**
- Endpoint for creating AzDO dashboards

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