import { qry } from "./qry.http.service.js";
import { BUCKET, SCOPES, COLLECTIONS } from "@/services/store.enum.js";

export async function getProject(id) {
  try {
    const req = {
      payload: {
        ql:
          `select * ` +
          `from ${BUCKET}.${SCOPES.DEFINITIONS}.${COLLECTIONS.PROJECTS} ` +
          `where id = '${id}'`,
        params: [],
      },
      filter: {
        node_type: COLLECTIONS.PROJECTS,
      },
    };

    const data = await qry(req);
    return data[0];
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}

export async function getProjects() {
  try {
    const req = {
      payload: {
        ql: `select * from ${BUCKET}.${SCOPES.DEFINITIONS}.${COLLECTIONS.PROJECTS}`,
        params: [],
      },
      filter: {
        node_type: COLLECTIONS.PROJECTS,
      },
    };

    const data = await qry(req);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}
