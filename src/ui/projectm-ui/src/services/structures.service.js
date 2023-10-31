import { publishStructureCmd } from "./cmd.service.js";
import { CMD_TYPES } from "./cmd-types.enum.js";
import { CMD_CATEGORIES } from "./cmd-categories.enum.js";
import { buildCoreCmd, buildCmdMetadata } from "./core-cmd.builder.js";

const TRGT_COLLECTION_HASH = {
  [CMD_TYPES.BUILD_WEIGHTED_WORK_ITEM_TREE]: "weighted_trees",
  [CMD_TYPES.BUILD_SUMMARIZED_WORK_ITEM_TREE]: "summarized_trees",
};

const buildStructureCmd = (data) => {
  const { cmdType, idempotencyId, projectId, key } = data;

  const cmdData = {};

  const cmdPostOp = {
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
      trgt_scope: "structures",
      trgt_collection: TRGT_COLLECTION_HASH[cmdType],
      key: key,
    },
  };
  const cmdPreOp = {};

  const cmdMetadata = buildCmdMetadata(
    idempotencyId,
    projectId,
    cmdPreOp,
    cmdPostOp
  );

  const cmd = buildCoreCmd(
    CMD_CATEGORIES.STRUCTURE,
    cmdType,
    cmdData,
    cmdMetadata
  );

  return cmd;
};

export async function structure(data) {
  const req = buildStructureCmd(data);
  await publishStructureCmd(req);
}
