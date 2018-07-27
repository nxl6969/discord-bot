'use strict';

const api = require('./api');
const round = require('lodash/round');
//  Doesn't work without /lib/stripIndents
const stripIndents = require('common-tags/lib/stripIndents');
const CURR_SEASON = 8;

module.exports = {
  getTeamInfo: function (players) {
    const idPromise = getPlayerIDs(players);
    const teamPromise = idPromise.then(ids => getTeam(ids));
    return Promise.all([idPromise, teamPromise]).then(([ids, team]) => {
      return formatTeamData(team.data.data.find((obj) => {
        return ids.every(ele => obj.attributes.stats.members.includes(ele));
      }).attributes);
    });
  }
};

function getPlayerIDs(players) {
  const params = { 'filter[playerNames]': players.join() };
  return api.get('/players', { params })
    .then(res => res.data.data.map(player => player.id));
}

function getTeam(ids) {
  const params = { 'tag[season]': CURR_SEASON, 'tag[playerIds]': ids.join() };
  return api.get('/teams', { params });
}

function formatTeamData(teamData) {
  const winRate = round((teamData.stats.wins /
    (teamData.stats.losses + teamData.stats.wins) * 100), 2);
  return stripIndents`
    Team Name: ${teamData.name}
    Rank: ${formatLeague(teamData.stats.league)} League | Division ${teamData.stats.division}
    Division Rating: ${teamData.stats.divisionRating}
    Wins: ${teamData.stats.wins}
    Losses: ${teamData.stats.losses}
    Win Rate: ${winRate}%
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
