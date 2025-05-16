// /cltcrime/server/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch').default; 

const app = express();

app.use(cors());

const BASE_URL = 'https://gagegaspar0.github.io/cmpd-data/';


app.get('/api/crime/:letter', async (req, res) => {
  const letter = req.params.letter;

  if (!/^[A-Za-z]$/.test(letter)) {
    return res.status(400).json({ error: 'Invalid letter parameter' });
  }


  const url = `${BASE_URL}crime_data_${encodeURIComponent(letter)}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
    }

    let text = await response.text();
    text = text.replace(/NaN/g, 'null'); 
    const data = JSON.parse(text);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});
 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});