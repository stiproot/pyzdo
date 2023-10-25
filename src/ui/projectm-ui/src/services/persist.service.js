import { publishPersistCmd } from "./cmd.service";
import { CMD_CATEGORIES } from "./cmd-categories.enum";
import { CMD_TYPES } from "./cmd-types.enum";
import { buildCoreCmd } from "./core-cmd.builder";

const buildCmd = (data) => {
  const { cmdData, cmdMetadata } = data;

  const cmd = buildCoreCmd(
    CMD_CATEGORIES.PERSIST,
    CMD_TYPES.PERSIST_TO_STORE,
    cmdData,
    cmdMetadata
  );

  return cmd;
};

export async function persist(data) {
  const req = buildCmd(data);
  await publishPersistCmd(req);
}
