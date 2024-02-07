#!/bin/bash

kubectl apply -f mandy-ui.yml
kubectl apply -f mandy-db.yml
kubectl apply -f kafka/kafka.yml
kubectl apply -f kafka/kafka-service.yml

kubectl apply -f mandy-cb-api.yml
kubectl apply -f mandy-kafka-api.yml
kubectl apply -f mandy-ui-api.yml

kubectl apply -f mandy-azdo-worker.yml
kubectl apply -f mandy-persist-worker.yml
kubectl apply -f mandy-insights-worker.yml
