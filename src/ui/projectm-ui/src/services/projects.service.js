import { persist } from "./persist.service.js";
import { BUCKET, SCOPES, COLLECTIONS } from "@/services/store.enum.js";
import { generateGuid } from "./guids.service.js";

const buildCmd = (data) => {
  const cmd = {
    cmdData: data,
    cmdMetadata: {
      idempotency_id: generateGuid(),
      project_id: data.id,
      cmd_post_op: {
        store: {
          trgt_bucket: BUCKET,
          trgt_scope: SCOPES.DEFINITIONS,
          trgt_collection: COLLECTIONS.PROJECTS,
          key: data.id,
        },
      },
    },
  };
  return cmd;
};

export async function upsertProject(data) {
  await persist(buildCmd(data));
}
