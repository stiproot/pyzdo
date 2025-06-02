#!/bin/sh

docker build -f Dockerfile -t img-pyzdo-cb-api-$1 .

docker run --network pyzdo --name pyzdo-cb-api-$1 -p 8000:8001 -it --detach img-pyzdo-cb-api-$1
