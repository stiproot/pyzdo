#!/bin/sh

rm -r ./dist/
npm run build
cp .env ./dist/

docker build -f Dockerfile -t img-pyzdo-ui-$1 .

docker run --network pyzdo --name pyzdo-ui-$1 -p 7080:80 -it --detach img-pyzdo-ui-$1

# docker exec -it projectm-ui-$1 sh
