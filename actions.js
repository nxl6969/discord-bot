'use strict';

const playerService = require('./services/player.js');
const stripIndents = require('common-tags/lib/stripIndents');

module.exports = {
  ping: () => 'pong',
  info,
  help,
  purge
};

function purge(message, count) {
  const deleteCount = parseInt(count, 10);
  if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
    return 'Please provide a valid number between 2 and 100';
  }
  return message.channel.fetchMessages({ limit: (deleteCount + 1) })
    .then(fetched => message.channel.bulkDelete(fetched))
    .then(() => `Successfully purged ${count} messages.`);
}

function help() {
  return stripIndents`
    ~*~List of Commands~*~
    !info *name1,name2...* (Lists team info for the specified team members)
    !purge *amount* (Deletes specified number of messages up to 100
  `;
}

function info(message, args) {
  if (!args || args.length < 2) {
    return 'Invalid arguments provided. Try !help';
  }
  return playerService.getTeamInfo(args);
}
