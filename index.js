const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./general/config.json');
const prefix = config.prefix;
const token = config.token;
const status = config.status;
const key = config.hyp_api_key;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
})

client.on('message', msg => {
  console.log(`Discord-From: ${msg.author.tag} Channel: ${msg.channel.name} Message: ${msg.content}`);
  
  if (msg.author.bot || msg.channel.type == 'dm' || !msg.content.startsWith(prefix)) return;
  client.user.setActivity(status);

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLocaleLowerCase();

  if (command == 'gexp') {
    const https = require("https");

    var uuid = "";

    var options = {
      hostname: "api.hypixel.net",
      path: `/player?key=${key}&name=${args[0]}`,
      method: "GET"
    }

    const request = https.request(options, response => {
      console.log(`statusCode: ${response.statusCode}`);

      body = "";

      response.on("data", function(data) {
        body += data;
      })

      response.on("end", function() {
        if (args && JSON.parse(body).player != null) {
          uuid = JSON.parse(body).player.uuid;
        } else {
          msg.channel.send("Player doesn not exsist");
        }
      })
      
    })
    request.on('error', error => {
      console.error(error);
    })
    request.end();

    options = {
      hostname: "api.hypixel.net",
      path: `/guild?key=${key}&name=envision`,
      method: "GET"
    }
    const req = https.request(options, response => {
      console.log(`statusCode: ${response.statusCode}`);

      body = "";

      response.on("data", function(data) {
        body += data;
      })

      response.on("end", function() {
        if (args && JSON.parse(body).success != null) {
          for (i in JSON.parse(body).guild.members) {
            if (JSON.parse(body).guild.members[i].uuid == uuid) {
              if (JSON.parse(body).guild.members[i].expHistory[args[1]] != null) {
                msg.channel.send(`${JSON.parse(body).guild.members[i].expHistory[args[1]]} is ${args[0]}'s gexp for ${args[1]}`);
              } else {
                msg.channel.send(`Can not find information for the date given`);
              }
            }
          }
          
        } else {
          msg.channel.send("could not retrieve stats");
        }
      })
      
    })
    req.on('error', error => {
      console.error(error);
    })
    req.end();
  }
})

client.login(token);