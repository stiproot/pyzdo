import { qry } from "./qry.http.service.js";
import { buildCoreQry } from "./core-qry.builder.js";
import { SCOPES, COLLECTIONS } from "./store.enum.js";

const SUMMARIZED_TREE_ID = "summarized_tree";
const WEIGHTED_TREE_ID = "weighted_tree";

const buildQry = (id, projectId, collection) => {
  const qry = buildCoreQry(SCOPES.STRUCTURES, collection, id, projectId);
  return qry;
};

export async function getSummarizedTree(projectId) {
  const req = buildQry(
    SUMMARIZED_TREE_ID,
    projectId,
    COLLECTIONS.SUMMARIZED_TREES
  );
  const resp = await qry(req);
  return resp[0] || {};
}

export async function getWeightedTree(projectId) {
  const req = buildQry(WEIGHTED_TREE_ID, projectId, COLLECTIONS.WEIGHTED_TREES);
  const resp = await qry(req);
  return resp[0] || {};
}
