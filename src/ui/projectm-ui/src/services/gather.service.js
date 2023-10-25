import { CMD_TYPES } from "./cmd-types.enum.js";
import { CMD_CATEGORIES } from "./cmd-categories.enum.js";
import { publishGatherCmd } from "./cmd.service.js";
import { buildCoreCmd, buildCmdMetadata } from "./core-cmd.builder.js";

const findTrgtCollection = (data) => {
  if (data.indexOf("Epic") > -1) {
    return "epics";
  }
  if (data.indexOf("Feature") > -1) {
    return "features";
  }
  if (data.indexOf("User Story") > -1) {
    return "user_stories";
  }
  if (data.indexOf("Task") > -1) {
    return "tasks";
  }
  if (data.indexOf("Bug") > -1) {
    return "bugs";
  }

  throw new Error("Unknown work item type");
};

const buildGatherCmd = (data) => {
  const { processId, projectId, ql } = data;

  const cmdData = { ql: ql };
  const cmdPostOpData = {
    enrichment: {
      add_property_map: [
        {
          key: "__metadata__",
          val: { project_id: projectId },
        },
      ],
    },
    store: {
      trgt_bucket: "project_m",
      trgt_scope: "azdo",
      trgt_collection: findTrgtCollection(ql),
    },
  };
  const cmdPreOpData = {};

  const cmdMetadata = buildCmdMetadata(
    processId,
    projectId,
    cmdPreOpData,
    cmdPostOpData
  );

  const cmd = buildCoreCmd(
    CMD_CATEGORIES.GATHER,
    CMD_TYPES.GATHER_PROJECT_UNITS_OF_WORK,
    cmdData,
    cmdMetadata
  );

  console.log("gather_cmd:", cmd);

  return cmd;
};

// const buildGatherCmd = (projectId, processId, ql) => {
//   return {
//     cmd: {
//       cmd_type: "GATHER_PROJECT_UNITS_OF_WORK",
//       ql: ql,
//     },
//     metadata: {
//       attributes: {
//         project_id: projectId,
//       },
//       process: {
//         process_id: processId,
//       },
//       store: {
//         bucket_name: "project_m",
//         scope_name: "azdo",
//         trgt_collection: findTrgtCollection(ql),
//       },
//     },
//   };
// };

export async function gather(data) {
  const req = buildGatherCmd(data);
  console.log("gather_req:", req);
  await publishGatherCmd(req);
}
