'use strict';
const api = require('./api');
const round = require('lodash.round');
//  Doesn't work without /lib/stripIndents
const stripIndents = require('common-tags/lib/stripIndents');
const CURR_SEASON = 8;
let idArr = [];

module.exports = {
  getTeamInfo: function (...players) {
    return getTeam(players)
      .then(res => {
        return formatTeamData(res.data.data.find((obj) => {
          return idArr.every(ele => obj.attributes.stats.members.includes(ele));
        }).attributes);
      }).catch(err => {
        console.log(err);
      });
  }
};

function getPlayerIDs(...players) {
  const params = { 'filter[playerNames]': players.join() };
  return api.get('/players', { params })
    .then(res => res.data.data.map(player => player.id));
}

function getTeam(...players) {
  return getPlayerIDs(players)
    .then(ids => {
      idArr = ids;
      const params = { 'tag[season]': CURR_SEASON, 'tag[playerIds]': ids.join() };
      return api.get('/teams', { params });
    });
}

function formatTeamData(teamData) {
  return stripIndents`
    Team Name: ${teamData.name}
    Rank: ${formatLeague(teamData.stats.league)} League | Division ${teamData.stats.division}
    Division Rating: ${teamData.stats.divisionRating}
    Wins: ${teamData.stats.wins}
    Losses: ${teamData.stats.losses}
    Win Rate: ${round((teamData.stats.wins / (teamData.stats.losses + teamData.stats.wins) * 100), 2)}%
  `;
}

function formatLeague(league) {
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
