'use strict';

const { Axios } = require('axios');
const key = require('../config.json').battleriteAPIKey;
const CURR_SEASON = 8;
const format = require('../helpers/format');
const defaults = {
  baseURL: 'https://api.developer.battlerite.com/shards/global/',
  headers: {
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/vnd.api+json'
  }
};

class ApiClient extends Axios {
  constructor(options) {
    super(Object.assign({}, defaults, options));
  }

  getPlayerIDs(players) {
    const params = { 'filter[playerNames]': players.join() };
    return this.get('/players', { params })
      .then(res => res.data.data.map(player => player.id));
  }

  getTeam(ids) {
    const params = { 'tag[season]': CURR_SEASON, 'tag[playerIds]': ids.join() };
    return this.get('/teams', { params });
  }

  getTeamInfo(players) {
    const idPromise = this.getPlayerIDs(players);
    const teamPromise = idPromise.then(ids => this.getTeam(ids));
    return Promise.all([idPromise, teamPromise]).then(([ids, team]) => {
      return format(team.data.data.find((obj) => {
        return ids.every(ele => obj.attributes.stats.members.includes(ele));
      }).attributes);
    });
  }
}

module.exports = new ApiClient();
