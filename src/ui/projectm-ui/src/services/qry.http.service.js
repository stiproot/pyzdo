import { post } from "./http-client.js";

export async function qry(req) {
  try {
    const data = await post("/data/qry", req);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}
