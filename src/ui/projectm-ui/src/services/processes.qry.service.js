import { qry } from "./qry.http.service.js";
import { buildCoreQry } from "./core-qry.builder.js";
import { BUCKET, SCOPES, COLLECTIONS } from "@/services/store.enum.js";

export async function getProcess(id, projectId) {
  try {
    const req = buildCoreQry(
      SCOPES.DEFINITIONS,
      COLLECTIONS.PROCESSES,
      id,
      projectId
    );
    const data = await qry(req);
    return data[0];
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}

export async function getProcesses(ids) {
  try {
    const formattedIds = ids.map((id) => `'${id}'`).join(",");

    const ql =
      `select * from ` +
      `${BUCKET}.${SCOPES.DEFINITIONS}.${COLLECTIONS.PROCESSES} ` +
      `where id in [${formattedIds}]`;

    const req = {
      payload: {
        ql: ql,
        params: [],
      },
      filter: {
        node_type: COLLECTIONS.PROCESSES,
      },
    };

    const data = await qry(req);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}
