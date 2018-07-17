'use strict';
const api = require('./api');

module.exports = {
  getPlayerIDs(...players) {
    const params = { 'filter[playerNames]': players.join() };
    return api.get('/players', { params })
      .then(res => res.data.data.map(player => player.id));
  },
  getTeamInfo(...players) {
    return this.getPlayerIDs(players)
      .then(ids => {
        return ids;
      }).catch(err => {
        console.log(err);
      });
  }
};
