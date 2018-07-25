const playerService = require('./services/player.js');

module.exports = {
  ping: () => 'pong',
  info: (message, ...args) => playerService.getTeamInfo(...args),
  help,
  purge
};

function purge(message, count) {
  const deleteCount = parseInt(count);
  if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    return 'Please provide a valid number between 2 and 100';
  }
  return message.channel.fetchMessages({limit: (deleteCount + 1)})
    .then(fetched => message.channel.bulkDelete(fetched))
    .then(() => 'Successfully purged ' + count + ' messages.');
}

function help() {
  return '~*~List of Commands~*~\n!info *name1,name2...*' +
  '(Lists team info for the specified team members)\n' +
  '!purge *amount* (Deletes specified number of messages up to 100';
}
