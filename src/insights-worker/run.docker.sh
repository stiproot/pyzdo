#!/bin/sh

docker build -f Dockerfile -t img-pyzdo-insights-worker-$1 .

docker run --network pyzdo --name pyzdo-insights-worker-$1 -it --detach img-pyzdo-insights-worker-$1
