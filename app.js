const express = require('express');
require('dotenv').config();
const config = require('./config');
const PowerBI = require('./power-bi');
const app = express();


const powerBi = new PowerBI();


app.get('/sample-embed-data', async (req, res) => {
  const result = await powerBi.generateSampleEmbedToken(req);
  console.log(result);
  return res.send(result);
});

app.get('/embed-data', async (req, res) => {
  const result = await powerBi.generateEmbedToken(req, res);
  return res.send(result);
});

app.all('*', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(config.PORT, () => {
  console.log('Server listening on port', config.PORT);
});