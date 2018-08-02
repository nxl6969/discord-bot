'use strict';

const { Client } = require('discord.js');
const config = require('./config.json');
const actions = require('./helpers/actions');

const isCommandInvocation = msg => msg.startsWith(config.prefix);
const client = new Client();

client.on('message', message => {
  if (!isCommandInvocation(message.content)) return;
  const { args, command } = parseMessage(message);
  const action = actions[command];
  if (!action) return message.channel.send('No such command. Try !help');
  return Promise.resolve(action(message, args))
    .then(result => message.channel.send(result))
    .catch(err => {
      console.error(err);
      message.channel.send('Oops! Something went wrong :(');
    });
});

function parseMessage(message) {
  const args = message.content.slice(config.prefix.length).trim().split(/\s+/g);
  const command = args.shift().toLowerCase();
  return { args, command };
}

client.login(config.token);
