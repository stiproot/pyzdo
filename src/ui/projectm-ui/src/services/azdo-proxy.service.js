import { publishAzdoProxyCmd } from "./cmd.service.js";
import { CMD_CATEGORIES } from "./cmd-categories.enum.js";
import { buildCoreCmd, buildCmdMetadata } from "./core-cmd.builder.js";

const buildAzdoProxyCmd = (data) => {
  const { projectId, idempotencyId, cmdData, cmdType } = data;

  const cmdPostOp = {};
  const cmdPreOp = {};

  const cmdMetadata = buildCmdMetadata(
    idempotencyId,
    projectId,
    cmdPreOp,
    cmdPostOp
  );

  const cmd = buildCoreCmd(CMD_CATEGORIES.EXT, cmdType, cmdData, cmdMetadata);

  return cmd;
};

export async function ext(data) {
  const cmd = buildAzdoProxyCmd(data);
  await publishAzdoProxyCmd(cmd);
}
