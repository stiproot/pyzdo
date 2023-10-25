#!/bin/sh

docker build -f Dockerfile -t img-mandy-azdo-worker-$1 .

docker run --network project-m_mandy --name mandy-azdo-worker-$1 -it --detach img-mandy-azdo-worker-$1
