import unittest
from get_wi_details_cmd_processor import GetWiDetailsCmdProcessor, GetWiDetailsCmd


class TestGetWiDetailsCmdProcessor(unittest.TestCase):
    def test_get_wi_details(self):
        processor = GetWiDetailsCmdProcessor()
        cmd = GetWiDetailsCmd(id=1097284)

        resp = processor.process(cmd)

        self.assertTrue(resp is not None)


if __name__ == "__main__":
    unittest.main()
