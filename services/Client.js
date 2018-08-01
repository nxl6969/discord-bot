'use strict';

const { Axios } = require('axios');
const key = require('../config.json').battleriteAPIKey;
const stripIndents = require('common-tags/lib/stripIndents');
const CURR_SEASON = 8;
const round = require('lodash/round');

class MyClient extends Axios {
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
      return this.formatTeamData(team.data.data.find((obj) => {
        return ids.every(ele => obj.attributes.stats.members.includes(ele));
      }).attributes);
    });
  }

  formatTeamData(teamData) {
    const winRate = round((teamData.stats.wins /
      (teamData.stats.losses + teamData.stats.wins) * 100), 2);
    return stripIndents`
      Team Name: ${teamData.name}
      Rank: ${this.formatLeague(teamData.stats.league)} League | Division ${teamData.stats.division}
      Division Rating: ${teamData.stats.divisionRating}
      Wins: ${teamData.stats.wins}
      Losses: ${teamData.stats.losses}
      Win Rate: ${winRate}%
    `;
  }

  formatLeague(league) {
    return {
      '0': 'Bronze',
      '1': 'Silver',
      '2': 'Gold',
      '3': 'Platinum',
      '4': 'Diamond',
      '5': 'Champion',
      '6': 'Grand Champion',
      'default': 'None'
    }[league || 'default'];
  }
}

module.exports = new MyClient({
  baseURL: 'https://api.developer.battlerite.com/shards/global/',
  headers: {
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/vnd.api+json'
  }
});
