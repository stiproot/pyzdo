import { generateGuid } from "./guids.service";

export const buildCmdPreOp = (data) => ({ cmd_pre_op: data });

export const buildCmdPostOp = (data) => ({ cmd_post_op: data });

export const buildCoreCmd = (cmdCategory, cmdType, cmdData, cmdMetadata) => {
  const cmd = {
    cmd_category: cmdCategory,
    cmd_type: cmdType,
    cmd_data: cmdData,
    cmd_metadata: cmdMetadata,
  };

  return cmd;
};

export const buildCmdMetadata = (
  idempotencyId = generateGuid(),
  projectId = "project_x",
  cmdPreOp = {},
  cmdPostOp = {}
) => {
  const metadata = {
    idempotency_id: idempotencyId,
    project_id: projectId,
    cmd_pre_op: cmdPreOp,
    cmd_post_op: cmdPostOp,
  };

  return metadata;
};
