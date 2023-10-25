#!/bin/sh

docker build -f Dockerfile -t img-mandy-kafka-api-$1 .

docker run --network mandy --name mandy-kafka-api-$1 -p 8001:8002 -it --detach img-mandy-kafka-api-$1
