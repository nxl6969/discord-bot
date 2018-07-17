'use strict';
const api = require('./api');
const CURR_SEASON = 8;

module.exports = {
  getPlayerIDs(...players) {
    const params = { 'filter[playerNames]': players.join() };
    return api.get('/players', { params })
      .then(res => res.data.data.map(player => player.id));
  },
  getTeamInfo(...players) {
    return this.getPlayerIDs(players)
      .then(ids => {
        const params = { 'tag[season]': CURR_SEASON, 'tag[playerIds]': ids.join() };
        return api.get('/teams', {params});
      })
      .then(res => {
        return res.data.data;
      }).catch(err => {
        console.log(err);
      });
  }
};
