#!/bin/bash

kubectl delete -f kafka/kafka-service.yml
kubectl delete -f kafka/kafka.yml

kubectl delete -f pyzdo-cb-api.yml
kubectl delete -f pyzdo-kafka-api.yml
kubectl delete -f pyzdo-ui-api.yml

kubectl delete -f pyzdo-azdo-worker.yml
kubectl delete -f pyzdo-persist-worker.yml
kubectl delete -f pyzdo-insights-worker.yml

kubectl delete -f pyzdo-db.yml
kubectl delete -f pyzdo-ui.yml
