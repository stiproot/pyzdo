import { persist } from "./persist.service.js";
import { BUCKET, SCOPES, COLLECTIONS } from "@/services/store.enum.js";

const buildCmd = (data) => {
  const cmd = {
    cmdData: data,
    cmdMetadata: {
      cmd_post_op: {
        store: {
          trgt_bucket: BUCKET,
          trgt_scope: SCOPES.DEFINITIONS,
          trgt_collection: COLLECTIONS.PROCESSES,
        },
      },
    },
  };
  return cmd;
};

export async function upsertProcesses(data) {
  await Promise.all(data.map(async (d) => upsertProcess(d)));
}

export async function upsertProcess(data) {
  const cmd = buildCmd(data);
  await persist(cmd);
}
