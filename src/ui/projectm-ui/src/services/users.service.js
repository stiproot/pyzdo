import { query } from "./query.service.js";

const BUCKET = "users";
const SCOPE = "users";
const COLLECTION = "users";

export async function getUser(userId) {
  try {
    const req = {
      payload: {
        ql: `select * from ${BUCKET}.${SCOPE}.${COLLECTION} where id = ${userId}`,
        params: [],
      },
      filter: {
        node_type: COLLECTION,
      },
    };

    const data = await query(req);
    return data[0];
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}
