const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const playerService = require('./services/player.js');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'terminate') {
    client.destroy();
  }

  if (command === 'ping') {
    message.channel.send('pong');
  }

  if (command === 'info') {
    playerService.getTeamInfo(args[0], args[1])
      .then(ids => {
        console.log(ids);
      })
      .catch(err => {
        console.log(err);
      });
  }
});

client.login(config.token);
