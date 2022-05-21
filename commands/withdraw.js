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

    if(!args[0]) return message.channel.send(`> :x: Usage: ***${prefix}withdraw <amount/all>***`);
    
    if(!parseInt(args[0]) && !args[0] === "all" || args[0].includes("-")) return message.channel.send(`> :x: That isn't a valid amount to withdraw!`);

    if(bank === 0) return message.channel.send(`> :x: You don't have any money in your bank to withdraw to your pockets!`);

    if(parseInt(args[0])) {
      if(parseInt(args[0]) > bank) return message.channel.send(`> :x: You don't have that much money in your bank!`);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, parseInt(args[0]));

      db.add(`${message.guild.id}.${message.author.id}.bank`, -parseInt(args[0]));

      message.channel.send(`> :white_check_mark: I withdrew \`${args[0]}\` coins from your bank to your pockets!`);
    }

    if(args[0] === "all") {
      message.channel.send(`> :white_check_mark: I withdrew \`${bank}\` coins from your bank to your pockets!`);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, bank);

      db.add(`${message.guild.id}.${message.author.id}.bank`, -bank);
    }
  }

  module.exports.help = {
    name: "withdraw",
    aliases: ["with"],
    category: "money"
}