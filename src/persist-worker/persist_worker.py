from multiprocessing import JoinableQueue, Process
from pyzdo_core import (
    HttpClient,
    KafkaConsumerRootCmdProvider,
    EnvVarProvider,
)
from persist_cmd_processor import PersistCmdProcessor
import time

env_var_provider = EnvVarProvider()
WORKER_TOPIC = env_var_provider.get_env_var(
    "WORKER_TOPIC", "topic_projectm_cmd_persist"
)
PERSIST_URL = env_var_provider.get_env_var(
    "PERSIST_URL", "http://localhost:8000/cb/cmd"
)
BULK_PERSIST_URL = env_var_provider.get_env_var(
    "BULK_PERSIST_URL", "http://localhost:8000/cb/cmds"
)
print("ENVIRONMENT VARIABLES:")
print(f"WORKER_TOPIC: {WORKER_TOPIC}")
print(f"PERSIST_URL: {PERSIST_URL}")


def queue_cmds(queue: JoinableQueue) -> None:
    cmd_provider = KafkaConsumerRootCmdProvider(topic=WORKER_TOPIC)

    while True:
        cmds = cmd_provider.provide()
        if cmds is None:
            break
        for cmd in cmds:
            queue.put(cmd)


def process_cmds(queue: JoinableQueue):
    http_client = HttpClient(PERSIST_URL)
    bulk_http_client = HttpClient(BULK_PERSIST_URL)
    cmd_processor = PersistCmdProcessor(
        http_client=http_client, bulk_http_client=bulk_http_client
    )

    while True:
        msg = queue.get()
        if msg is None:
            break
        cmd_processor.process(msg)
        queue.task_done()


def main():
    print("Starting persist worker...")
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
