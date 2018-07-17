'use strict';
const api = require('./api');
const round = require('lodash.round');
//  Doesn't work without /lib/stripIndents
const stripIndents = require('common-tags/lib/stripIndents');
const CURR_SEASON = 8;

module.exports = {
  getTeamInfo(...players) {
    let idArr = [];
    return getPlayerIDs(players)
      .then(ids => {
        idArr = ids;
        const params = { 'tag[season]': CURR_SEASON, 'tag[playerIds]': ids.join() };
        return api.get('/teams', { params });
      })
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
  switch (league) {
    case 6: return 'Grand Champion';
    case 5: return 'Champion';
    case 4: return 'Diamond';
    case 3: return 'Platinum';
    case 2: return 'Gold';
    case 1: return 'Silver';
    case 0: return 'Bronze';
    default: return 'None';
  }
}
