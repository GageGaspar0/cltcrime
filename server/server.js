// /cltcrime/server/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 

const app = express();
app.use(cors());


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

