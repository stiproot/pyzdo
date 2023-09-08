from multiprocessing import JoinableQueue, Process
from gather_project_units_of_work_workflow import (
    gather_project_units_of_work_workflow,
)
from kafka_consumer_cmd_provider import KafkaConsumerCmdProvider
from uuid import uuid4
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.cmd_types import CmdTypes


def generate_consumer_group_id() -> str:
    return f"tmp_consumer_group_{uuid4()}"


consumer_group_id = "azdo_worker"
topic = "topic_projectm_cmd_insights_gather"

cmd_provider = KafkaConsumerCmdProvider(
    consumer_group_id=generate_consumer_group_id(), topic=topic
)

workflow_hash = {
    CmdTypes.GATHER_PROJECT_UNITS_OF_WORK: gather_project_units_of_work_workflow,
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
