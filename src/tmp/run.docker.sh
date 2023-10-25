#!/bin/sh

docker build -f Dockerfile -t img-tmp-consumer-$1 .

docker run --network project-m_mandy --name tmp-consumer-$1 -it --detach img-tmp-consumer-$1
