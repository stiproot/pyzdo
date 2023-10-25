#!/bin/sh

docker build -f Dockerfile -t img-mandy-persist-worker-$1 .

docker run --network project-m_mandy --name mandy-persist-worker-$1 -it --detach img-mandy-persist-worker-$1
