import { post } from "./http-client.js";

export async function publishPersistCmd(cmd) {
  try {
    const data = await post("/data/cmd/persist", cmd);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}

export async function publishGatherCmd(cmd) {
  try {
    const data = await post("/data/cmd/gather", cmd);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}

export async function publishStructureCmd(cmd) {
  try {
    const data = await post("/data/cmd/structure", cmd);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}

export async function publishAzdoProxyCmd(cmd) {
  try {
    const data = await post("/proxy/azdo/cmd", cmd);
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return [];
  }
}
