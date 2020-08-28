const axios = require('axios');
const _ = require('lodash');
const { URL } = require('./constants');

const getPeople = async (resultsArr = [], nextPage = `${URL}/people`) => {
  const { data: { next, results }} = await axios.get(nextPage)
  resultsArr.push(...results);
  if (!_.isNil(next)) await getPeople(resultsArr, next);
  return resultsArr;
};

const getSortedPeople = async (sortBy) => {
  const allPeople = await getPeople();
  if (sortBy !== 'name') {
    _.forEach(allPeople, (person) => {
        const newVal = person[sortBy].replace(',', '');
        person[sortBy] = (person[sortBy] === 'unknown') ? -1 : parseInt(newVal, 10);
    });
  }
  return _.sortBy(allPeople, sortBy);
};

const getPlanets = async (resultsArr = [], nextPage = `${URL}/planets`) => {
  const promises = [];
  const { data: { next, results }} = await axios.get(nextPage)
  _.forEach(results, async (result) => {
    const { residents } = result;
    _.forEach(residents, resident => {
      promises.push(axios.get(resident));
    })
  });
  const residentsData = await Promise.all(promises);
  _.forEach(results, (result) => {
    const { residents } = result;
    const residentNames = [];
    _.forEach(residents, (resident) => {
      const { data: { name }} = _.find(residentsData, ({ data: { url }}) => url === resident);
      residentNames.push(name);
    });
    result.residents = residentNames;
  })
  resultsArr.push(...results);
  if (!_.isNil(next)) await getPlanets(resultsArr, next);
  return resultsArr;
};

module.exports = {
  getPeople,
  getPlanets,
  getSortedPeople,
};