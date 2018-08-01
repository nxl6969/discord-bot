const stripIndents = require('common-tags/lib/stripIndents');
const round = require('lodash/round');

module.exports = teamData => {
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
};

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
