#!/bin/sh

docker build -f Dockerfile -t img-mandy-cb-api-$1 .

docker run --network mandy --name mandy-cb-api-$1 -p 8000:8001 -it --detach img-mandy-cb-api-$1
