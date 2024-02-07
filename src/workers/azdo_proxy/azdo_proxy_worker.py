from multiprocessing import JoinableQueue, Process
from process_azdo_proxy_cmd_workflow import (
    process_azdo_proxy_cmd_workflow,
)
from pm_common import (
    KafkaConsumerRootCmdProvider,
    CmdTypes,
    EnvVarProvider,
)
import time


env_var_provider = EnvVarProvider()
WORKER_TOPIC = env_var_provider.get_env_var(
    "WORKER_TOPIC", "topic_projectm_cmd_azdo_proxy"
)


workflow_hash = {
    CmdTypes.CREATE_DASHBOARD: process_azdo_proxy_cmd_workflow,
    CmdTypes.BULK_CREATE_UNITS_OF_WORK: process_azdo_proxy_cmd_workflow,
    CmdTypes.CLONE_UNIT_OF_WORK: process_azdo_proxy_cmd_workflow,
    CmdTypes.UPDATE_UNIT_OF_WORK: process_azdo_proxy_cmd_workflow,
    CmdTypes.UPDATE_UNIT_OF_WORK_HIERARCHY: process_azdo_proxy_cmd_workflow,
}


def queue_cmds(queue: JoinableQueue) -> None:
    cmd_provider = KafkaConsumerRootCmdProvider(topic=WORKER_TOPIC)

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

        workflow_hash[msg.cmd_type](msg)

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
    time.sleep(30)
    main()
