from fastapi import APIRouter
from kafka.kafka_producer_manager import KafkaProducerManager
from models.publish_req import PublishReq
from json import dumps as json_dumps

router = APIRouter()


@router.post("/topic/publish")
async def publish_to_topic(req: PublishReq):
    manager = KafkaProducerManager(req.topic)
    json_payload = json_dumps(req.payload)
    manager.produce(req.key, json_payload)
    manager.flush()

    return {"status": "accepted"}
