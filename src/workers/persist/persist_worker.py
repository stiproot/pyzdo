from multiprocessing import JoinableQueue, Process
from kafka_consumer_cmd_provider import KafkaConsumerCmdProvider
from persist_cmd_processor import PersistCmdProcessor
from datetime import datetime
from uuid import uuid4
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from http_clients.http_client import HttpClient


def generate_consumer_group_id() -> str:
    dt = datetime.utcnow()
    formatted_dt = dt.strftime("%Y%m%dT%H%M%S")
    return f"persist_worker_{uuid4()}"


consumer_group_id = "persist_worker"
topic = "topic_core_persist"
perist_url = "http://localhost:8000/cb/command"
http_client = HttpClient(perist_url)


cmd_provider = KafkaConsumerCmdProvider(
    topic=topic, consumer_group_id=generate_consumer_group_id()
)
cmd_processor = PersistCmdProcessor(http_client=http_client)


def queue_cmds(queue: JoinableQueue) -> None:
    while True:
        cmds = cmd_provider.provide()
        if cmds is None:
            print("No commands to to q.")
            break
        for cmd in cmds:
            queue.put(cmd)


def process_cmds(queue: JoinableQueue):
    while True:
        msg = queue.get()
        if msg is None:
            break
        cmd_processor.process(msg)
        queue.task_done()


def main():
    NUM_PROCS = 1
    queue = JoinableQueue()

    providers = []
    for _ in range(NUM_PROCS):
        provider = Process(target=queue_cmds, args=(queue,))
        providers.append(provider)
        provider.start()

    workers = []
    for _ in range(NUM_PROCS):
        worker = Process(target=process_cmds, args=(queue,))
        workers.append(worker)
        worker.start()

    # for _ in range(NUM_PROCS):
    #     queue.put(None)  # Signal workers to exit

    for provider in providers:
        provider.join()

    for worker in workers:
        worker.join()


if __name__ == "__main__":
    main()
