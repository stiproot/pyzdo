from pyxi_process_manager.cmd_provider import CmdProvider
from pyxi_process_manager.process_cmd import ProcessCmd


class KafkaConsumerCmdProviderEmulator(CmdProvider):
    def provide(self) -> [ProcessCmd]:
        return [ProcessCmd() for _ in range(10)]
