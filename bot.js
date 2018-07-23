'use strict';

const { Client } = require('discord.js');
const config = require('./config.json');
const playerService = require('./services/player.js');

const isCommandInvocation = msg => msg.startsWith(config.prefix);
const client = new Client();
const actions = {
  ping: () => 'pong',
  info: (...args) => playerService.getTeamInfo(...args),
  help: () => '~*~List of Commands~*~\n!info *name1,name2...* (Lists team info' +
  ' for the listed team members)'
};

client.on('message', message => {
  if (!isCommandInvocation(message.content)) return;
  const { args, command } = parseMessage(message);
  const action = actions[command];
  if (!action) {
    message.channel.send('No such command. Try !help');
  } else {
    return Promise.resolve(action(...args))
      .then(result => message.channel.send(result))
      .catch(err => {
        console.error(err);
        message.channel.send('Oops! Something went wrong :(');
      });
  }
});

function parseMessage(message) {
  const args = message.content.slice(config.prefix.length).trim().split(/\s+/g);
  const command = args.shift().toLowerCase();
  return { args, command };
}

client.login(config.token);
