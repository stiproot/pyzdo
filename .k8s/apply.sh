#!/bin/bash

kubectl apply -f pyzdo-ui.yml
kubectl apply -f pyzdo-db.yml
kubectl apply -f kafka/kafka.yml
kubectl apply -f kafka/kafka-service.yml

kubectl apply -f pyzdo-cb-api.yml
kubectl apply -f pyzdo-kafka-api.yml
kubectl apply -f pyzdo-ui-api.yml

kubectl apply -f pyzdo-azdo-worker.yml
kubectl apply -f pyzdo-persist-worker.yml
kubectl apply -f pyzdo-insights-worker.yml
