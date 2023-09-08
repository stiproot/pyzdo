import time
from pyxi_process_manager import CmdProcessor, ProcessCmd, ProcessMetadataService


class PersistCmdProcessorEmulator(CmdProcessor):
    def process(self, cmd: ProcessCmd) -> None:
        metadata_service = ProcessMetadataService()
        print(
            "process()",
            "start",
            f"pid:{metadata_service.pid()}",
            f"cmd:{cmd.idempotency_id}",
        )

        time.sleep(2)

        print(
            "process()",
            "end",
            f"pid:{metadata_service.pid()}",
            f"cmd:{cmd.idempotency_id}",
        )
