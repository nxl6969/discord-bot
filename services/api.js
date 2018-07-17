let axios = require('axios');
let key = require('../config.json').battleriteAPIKey;

module.exports = axios.create({
  baseURL: 'https://api.developer.battlerite.com/shards/global/',
  headers: {
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/vnd.api+json'
  }
});
