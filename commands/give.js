const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let bank = db.get(`${message.guild.id}.${message.author.id}.bank`);
    let pockets = db.get(`${message.guild.id}.${message.author.id}.pockets`);
    let cock = db.get(`${message.guild.id}.${message.author.id}.cock`);
    let cfupgrade = db.get(`${message.guild.id}.${message.author.id}.cfupgrade`);
    if(!bank) bank = 0;
    if(!pockets) pockets = 0;
    if(!cock) cock = false;
    if(!cfupgrade) cfupgrade = 0;

    if(!args[0] || !args[1]) return message.channel.send(`> :x: Usage: ***${prefix}give <@member/member ID> <amount/all>***`);

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`> :x: Please mention a valid member of this server!`);

    let membersbank = db.get(`${message.guild.id}.${member.id}.bank`);
    let memberspockets = db.get(`${message.guild.id}.${member.id}.pockets`);
    let memberscock = db.get(`${message.guild.id}.${member.id}.cock`);
    let memberscfupgrade = db.get(`${message.guild.id}.${member.id}.cfupgrade`);
    if(!membersbank) membersbank = 0;
    if(!memberspockets) memberspockets = 0;
    if(!memberscock) memberscock = false;
    if(!memberscfupgrade) memberscfupgrade = 0;
    
    if(!parseInt(args[1]) && !args[1] === "all" || args[1].includes("-")) return message.channel.send(`> :x: That isn't a valid amount to give!`);

    if(pockets < 0) return message.channel.send(`> :x: You don't have any money in your pockets to give!`);

    if(parseInt(args[1]) < 1000) return message.channel.send(`> :x: The minimum amount of coins you can give is \`1000\` coins!`);

    if(parseInt(args[1])) {
      if(parseInt(args[1]) > pockets) return message.channel.send(`> :x: You don't have that much money in your pockets!`);

      if(parseInt(args[0]) > 10000) return message.channel.send(`> :x: The maximum amount of coins you can give is \`10000\` coins!`);

      db.add(`${message.guild.id}.${member.id}.pockets`, parseInt(args[1]));

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -parseInt(args[1]));

      message.channel.send(`> :white_check_mark: I gave ${member} \`${args[1]}\` coins from your pockets!`);
    }

    if(args[1] === "all") {
      if(pockets < 1000) return message.channel.send(`> :x: The minimum amount of coins you can give is \`1000\` coins!`);

      if(pockets > 10000) return message.channel.send(`> :x: The maximum amount of coins you can give is \`10000\` coins!`);

      message.channel.send(`> :white_check_mark: I gave ${member} \`${pockets}\` coins from your pockets!`);

      db.add(`${message.guild.id}.${member.id}.pockets`, pockets);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -pockets);
    }
  }

  module.exports.help = {
    name: "give",
    aliases: ["givemoney"],
    category: "money"
}