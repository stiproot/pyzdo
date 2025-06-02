#!/bin/sh

docker build -f Dockerfile -t img-tmp-consumer-$1 .

docker run --network pyzdo --name tmp-consumer-$1 -it --detach img-tmp-consumer-$1
