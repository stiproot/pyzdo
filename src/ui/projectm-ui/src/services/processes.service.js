import { persist } from "./persist.service.js";
import { BUCKET, SCOPES, COLLECTIONS } from "@/services/store.enum.js";

const buildCmd = (data) => {
  const cmd = {
    cmdData: data,
    cmdMetadata: {
      idempotency_id: data.id,
      project_id: data.project_id,
      cmd_post_op: {
        store: {
          trgt_bucket: BUCKET,
          trgt_scope: SCOPES.DEFINITIONS,
          trgt_collection: COLLECTIONS.PROCESSES,
          key: data.id,
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
