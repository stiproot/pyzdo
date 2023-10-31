from multiprocessing import JoinableQueue, Process
from build_summarized_work_item_tree_workflow import (
    build_summarized_work_item_tree_workflow,
)
from build_weighted_work_item_tree_workflow import (
    build_weighted_work_item_tree_workflow,
)
from pm_common import (
    KafkaConsumerRootCmdProvider,
    CmdTypes,
    generate_unique_name,
    EnvVarProvider,
)
import time

env_var_provider = EnvVarProvider()
GROUP_ID = env_var_provider.get_env_var(
    "GROUP_ID", generate_unique_name("insights_worker_")
)
WORKER_TOPIC = env_var_provider.get_env_var(
    "WORKER_TOPIC", "topic_projectm_cmd_insights_structure"
)


workflow_hash = {
    CmdTypes.BUILD_SUMMARIZED_WORK_ITEM_TREE: build_summarized_work_item_tree_workflow,
    CmdTypes.BUILD_WEIGHTED_WORK_ITEM_TREE: build_weighted_work_item_tree_workflow,
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
    # time.sleep(30)
    main()
