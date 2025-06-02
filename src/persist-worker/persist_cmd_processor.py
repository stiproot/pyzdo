from pyxi_process_manager import CmdProcessor
from pyzdo_core import HttpClient, RootCmd, CmdTypes, update_proc_status


class PersistCmdProcessor(CmdProcessor):
    def __init__(self, http_client: HttpClient, bulk_http_client: HttpClient):
        self._http_client = http_client
        self._bulk_http_client = bulk_http_client

    # def __map__(self, cmd: RootCmd) -> str:
    #     idempotency_id = cmd.cmd_metadata["idempotency_id"]
    #     project_id = cmd.cmd_metadata["project_id"]

    #     n1ql = f"UPDATE pyzdo.definitions.processes as c set c.status = 'COMPLETE' where c.id = '{idempotency_id}' AND c.project_id = '{project_id}'"

    #     cmd.cmd_metadata["cmd_post_op"]["post_persist_qrys"] = [n1ql]

    #     return cmd

    def process(self, cmd: RootCmd) -> None:
        try:
            print("Processing command...")
            print("Building command...")
            # json = self.__map__(cmd)._serialize_()
            json = cmd._serialize_()

            if cmd.cmd_type == CmdTypes.BULK_PERSIST_TO_STORE:
                print("Sending command to persist in bulk")
                self._bulk_http_client.post(json=json)
                update_proc_status("COMPLETE", cmd)
                return

            print("Sending command to persist")
            self._http_client.post(json=json)
            update_proc_status("COMPLETE", cmd)
        except:
            print(f"Error processing command: {cmd._serialize_()}")
            raise
        finally:
            print(f"Successfully processed command.")
