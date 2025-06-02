#!/bin/sh

docker build -f Dockerfile -t img-pyzdo-azdo-worker-$1 .

docker run --network pyzdo --name pyzdo-azdo-worker-$1 -it --detach img-pyzdo-azdo-worker-$1
