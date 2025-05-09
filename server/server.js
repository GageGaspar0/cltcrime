// /cltcrime/server/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const NodeCache = require('node-cache');
const fetch = require('node-fetch').default; 
const { createLogger, format, transports } = require('winston');

const app = express();

// —— CONFIGURATION ——

// Allowed CORS origin (set in env for production)
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN }));
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
  ]
});

const BASE_URL = 'https://gagegaspar0.github.io/cmpd-data/';


app.get('/api/crime/:letter', async (req, res) => {
  const letter = req.params.letter;

  if (!/^[A-Za-z]$/.test(letter)) {
    logger.warn(`Invalid letter parameter: "${letter}"`);
    return res.status(400).json({ error: 'Invalid letter parameter' });
  }

  const cacheKey = letter.toUpperCase();
  const cached = cache.get(cacheKey);
  if (cached) {
    res.set('Cache-Control', 'public, max-age=300');
    logger.info(`Cache hit for "${cacheKey}"`);
    return res.json(cached);
  }

  const url = `${BASE_URL}crime_data_${encodeURIComponent(letter)}.json`;
  try {
    logger.info(`Fetching URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
    }

    let text = await response.text();
    text = text.replace(/NaN/g, 'null'); 

    const data = JSON.parse(text);
    cache.set(cacheKey, data);
    res.set('Cache-Control', 'public, max-age=300');
    return res.json(data);
  } catch (err) {
    logger.error(`Error fetching/parsing for "${letter}": ${err.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});