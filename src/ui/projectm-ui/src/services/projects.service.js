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
          trgt_collection: COLLECTIONS.PROJECTS,
        },
      },
    },
  };
  return cmd;
};

export async function upsertProject(data) {
  await persist(buildCmd(data));
}
