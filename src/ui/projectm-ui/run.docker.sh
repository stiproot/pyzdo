#!/bin/sh

rm -r ./dist/
npm run build
cp .env ./dist/

docker build -f Dockerfile -t img-mandy-ui-$1 .

docker run --network project-m_mandy --name mandy-ui-$1 -p 7080:80 -it --detach img-mandy-ui-$1

# docker exec -it projectm-ui-$1 sh
