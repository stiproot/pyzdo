const express = require("express");
const cors = require("cors");
const { processQry } = require("./controllers/qrys.js");
const {
  processPersistCmd,
  processGatherCmd,
  processStructureCmd,
  processAzdoProxyCmd,
} = require("./controllers/cmds.js");

const BASE_URL = "/ui-api";
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());

app.post(`${BASE_URL}/data/qry`, express.json(), processQry);
app.post(`${BASE_URL}/data/cmd/persist`, express.json(), processPersistCmd);
app.post(`${BASE_URL}/data/cmd/gather`, express.json(), processGatherCmd);
app.post(`${BASE_URL}/data/cmd/structure`, express.json(), processStructureCmd);
app.post(`${BASE_URL}/proxy/azdo/cmd`, express.json(), processAzdoProxyCmd);
app.get(`${BASE_URL}/health`, (req, res) => {
  res.json({ healthy: true });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
