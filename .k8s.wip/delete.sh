#!/bin/bash

kubectl delete -f kafka/kafka-service.yml
kubectl delete -f kafka/kafka.yml

kubectl delete -f mandy-cb-api.yml
kubectl delete -f mandy-kafka-api.yml
kubectl delete -f mandy-ui-api.yml

kubectl delete -f mandy-azdo-worker.yml
kubectl delete -f mandy-persist-worker.yml
kubectl delete -f mandy-insights-worker.yml

kubectl delete -f mandy-db.yml
kubectl delete -f mandy-ui.yml
