from multiprocessing import JoinableQueue, Process
from build_work_item_tree_workflow import build_work_item_tree_workflow
from build_weighted_work_item_tree_workflow import (
    build_weighted_work_item_tree_workflow,
)
from kafka_consumer_cmd_provider import KafkaConsumerCmdProvider
from datetime import datetime
from uuid import uuid4
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from common.cmd_types import CmdTypes


def generate_consumer_group_id() -> str:
    dt = datetime.utcnow()
    formatted_dt = dt.strftime("%Y%m%dT%H%M%S")
    # return f"structure_insights_worker_{formatted_dt}"
    # return f"structure_insights_worker_123"
    return f"structure_insights_worker{uuid4()}"


consumer_group_id = "insights_worker"
topic = "topic_projectm_cmd_insights_structure"

cmd_provider = KafkaConsumerCmdProvider(
    consumer_group_id=generate_consumer_group_id(), topic=topic
)

workflow_hash = {
    CmdTypes.BUILD_WORK_ITEM_TREE: build_work_item_tree_workflow,
    CmdTypes.BUILD_WEIGHTED_WORK_ITEM_TREE: build_weighted_work_item_tree_workflow,
}


def queue_cmds(queue: JoinableQueue) -> None:
    while True:
        cmds = cmd_provider.provide()
        if cmds is None:
            break
        for cmd in cmds:
            queue.put(cmd)


def process_cmds(queue: JoinableQueue):
    while True:
        msg = queue.get()
        if msg is None:
            break
        workflow_hash[msg.cmd.cmd_type](msg)
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
