const { EBADF } = require('constants');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./general/config.json');
const prefix = config.prefix;
const token = config.token;
const status = config.status;
const key = config.hyp_api_key;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  function checkPartGames() {
    const https = require("https");

    var options = {
      hostname: "api.hypixel.net",
      path: `/player?key=${key}&name=`,
      method: "GET"
    }

    const request = https.request(options, response => {
      console.log(`statusCode: ${response.statusCode}`);
      body = "";
      response.on("data", function(data) {
        body += data;
      });
      response.on("end", function() {

      });
      request.on('error', error => {
        console.error(error);
      });
      request.end();
    });
  }
  setInterval(checkPartGames, (60 * 1000))
})

client.on('message', msg => {
  console.log(`Discord-From: ${msg.author.tag} Channel: ${msg.channel.name} Message: ${msg.content}`);
  
  if (msg.author.bot || msg.channel.type == 'dm' || !msg.content.startsWith(prefix)) return;
  client.user.setActivity(status);

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLocaleLowerCase();

  if (command == 'gexp') {
    const https = require("https");

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
          var player = false;

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
                    player = true;
                    if (JSON.parse(body).guild.members[i].expHistory[args[1]] != null) {
                      embed.addField(`${JSON.parse(body).guild.members[i].expHistory[args[1]]} is ${args[0]}'s gexp for ${args[1]}`);
                      embed.setColor('#32FF00');
                      return msg.channel.send(embed);
                    } else {
                      embed.addField(`Can not find information for the date given`);
                      embed.setColor('#FF0000');
                      return msg.channel.send(embed);
                    }
                  }
                }
                if (!player) {
                  embed.addField(`${args[0]} is not in the guild`);
                  embed.setColor('#FF0000');
                  return msg.channel.send(embed);
                }
              } else {
                embed.addField("Could not retrieve stats");
                embed.setColor('#FF0000');
                return msg.channel.send(embed);
              }
            })
            msg.channel.send(embed)
          })
          req.on('error', error => {
            console.error(error);
          })
          req.end();
        } else {
          embed.addField("Player doesn not exsist");
          embed.setColor('#FF0000');
          return msg.channel.send(embed)        }
      })
    })
    request.on('error', error => {
      console.error(error);
    })
    request.end();

  }
})

client.login(token);