require('dotenv').config();
const PowerBI = require('./power-bi');

const powerBI = new PowerBI();


process.nextTick(async () => {
  // const result = await powerBI.generateEmbedToken({query: {}});
  const result = await powerBI.generateSampleEmbedToken({});
  console.log(result);
});
