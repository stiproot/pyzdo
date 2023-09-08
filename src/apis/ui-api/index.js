const express = require('express');
const cors = require('cors');
const { get, post } = require('./http-client.js');

const corsOptions = {
  origin: ['http://localhost:3000'],
};

const app = express();
app.use(cors(corsOptions));

const BASE_URL = '/ui-api';

app.post(`${BASE_URL}/data/query`, express.json(), async (req, res) => {
  try {

    const reqBody = req.body;
    const data = await post('cb/query', reqBody.query);
    const nodeType = reqBody.filter.node_type;
    const refined = data['result'].map(item => item[nodeType]);
    res.json(refined);

  } catch (error) {
    debugger;
    console.error('GET request error:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
