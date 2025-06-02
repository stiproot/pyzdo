#!/bin/sh

docker build -f Dockerfile -t img-pyzdo-kafka-api-$1 .

docker run --network pyzdo --name pyzdo-kafka-api-$1 -p 8001:8002 -it --detach img-pyzdo-kafka-api-$1
