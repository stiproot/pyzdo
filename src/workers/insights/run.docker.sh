#!/bin/sh

docker build -f Dockerfile -t img-mandy-insights-worker-$1 .

docker run --network project-m_mandy --name mandy-insights-worker-$1 -it --detach img-mandy-insights-worker-$1
