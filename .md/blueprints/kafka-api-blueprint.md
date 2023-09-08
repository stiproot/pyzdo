## Get Consumer Configuration [GET /kafka/topic/{topic-name}/consumer/configuration]

Get consumer configuration for a topic.

+ Request (application/json)
    + Headers
        + x-idempotency-id: (string)
    
    + Parameters
        + topic-name: (string)

    + Attributes
        + configuration: (string)

+ Response 200 (application/json)
    + Attributes
        + result: (string)

## Publish Message [POST /kafka/topic/{topic-name}/publish]

Publish a message to a Kafka topic.

+ Request (application/json)
    + Headers
        + x-idempotency-id: (string)
    
    + Parameters
        + topic-name: (string)

    + Attributes
        + payload: (string)

+ Response 202 (application/json)
    + Attributes
        + status: (int, HTTP status code)