import unittest
from get_wis_by_wiql_cmd_processor import GetWisByWiqlCmdProcessor, GetWisByWiqlCmd


class TestGetWisByWiqlCmdProcessors(unittest.TestCase):
    def test_get_wis_by_wiql(self):
        print("Testing GetWisByWiqlCmdProcessor")
        processor = GetWisByWiqlCmdProcessor()
        cmd = GetWisByWiqlCmd(
            query='SELECT [System.Id],[System.WorkItemType],[System.Title],[System.AssignedTo],[System.State],[System.Tags] FROM WorkItems WHERE [System.TeamProject] = "Software" AND [System.WorkItemType] = "Feature" AND [System.Tags] CONTAINS "N2CP-RACI-Template-Feature" AND [System.Tags] CONTAINS "N2CP-RACI-Template-Development" ORDER BY [System.Title]'
        )

        resp = processor.process(cmd)

        self.assertTrue(len(resp) > 0)


if __name__ == "__main__":
    unittest.main()
