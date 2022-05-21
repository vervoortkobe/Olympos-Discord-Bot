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

    if(!args[0]) return message.channel.send(`> :x: Usage: ***${prefix}deposit <amount/all>***`);
    
    if(!parseInt(args[0]) && !args[0] === "all" || args[0].includes("-")) return message.channel.send(`> :x: That isn't a valid amount to deposit!`);

    if(pockets === 0) return message.channel.send(`> :x: You don't have any money in your pockets to deposit to your bank!`);

    if(parseInt(args[0])) {
      if(parseInt(args[0]) > pockets) return message.channel.send(`> :x: You don't have that much money in your pockets!`);

      db.add(`${message.guild.id}.${message.author.id}.bank`, parseInt(args[0]));

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -parseInt(args[0]));

      message.channel.send(`> :white_check_mark: I deposited \`${args[0]}\` coins from your pockets to your bank!`);
    }

    if(args[0] === "all") {
      message.channel.send(`> :white_check_mark: I deposited \`${pockets}\` coins from your pockets to your bank!`);

      db.add(`${message.guild.id}.${message.author.id}.bank`, pockets);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -pockets);
    }
  }

  module.exports.help = {
    name: "deposit",
    aliases: ["dep"],
    category: "money"
}