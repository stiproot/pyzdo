// const { get, post } = require("../http-client.js");
const HttpClient = require("../http-client.js");

// const BASE_URL = "http://0.0.0.0:8000/";
const CB_API_BASE_URL = process.env.CB_API_BASE_URL;

const client = new HttpClient(CB_API_BASE_URL);

const processResp = (req, resp) => {
  const nodeType = req.filter.node_type;
  const refined = resp["result"].map((item) => item[nodeType]);
  return refined;
};

const processQry = async (req, res) => {
  try {
    const reqBody = req.body;
    // const data = await post("cb/query", reqBody.payload);
    const data = await client.post("cb/qry", reqBody.payload);
    const processedResp = processResp(reqBody, data);
    res.json(processedResp);
  } catch (error) {
    console.error("GET request error:", error);
    res.status(500).json({ error: "Error processing query." });
  }
};

module.exports = { processQry };
