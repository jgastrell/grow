const express = require('express');
const { PORT } = require('./constants');
const { getPeople, getSortedPeople, getPlanets } = require('./helpers');

const app = express();

app.get('/people', async (req, res) => {
  const allPeople = req.query.sortBy ? await getSortedPeople(req.query.sortBy) : await getPeople();
  res.json({ results: allPeople });
});

app.get('/planets', async (req, res) => {
  const allPlanets = await getPlanets(); 
  res.json({ results: allPlanets });
});

app.listen(PORT, () => console.log(`Listening in port ${PORT}`));