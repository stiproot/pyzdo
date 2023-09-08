## Data Query [POST /couchbase/query]

Query data in Couchbase.

+ Request (application/json)
    + Headers
        + x-idempotency-id: "string?"

    + Attributes
        + scope: (string, optional)
        + collection: (string, optional)
        + query: (string)

+ Response 200 (application/json)
    + Attributes
        + result: (array)

## Data Command [POST /couchbase/command]

Execute a command against Couchbase.

+ Request (application/json)
    + Headers
        + x-idempotency-id: (string)

    + Attributes
        + scope: (string, optional)
        + collection: (string, optional)
        + command: (string)

+ Response 201 (application/json)
    + Attributes
        + status: (int, HTTP status code)