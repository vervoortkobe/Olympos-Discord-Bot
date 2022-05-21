const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const countdowns = require("../countdowns.json");
const cooldown = new Set();
const ctime = 30000;

module.exports.run = async (client, message, args) => {

    let bank = db.get(`${message.guild.id}.${message.author.id}.bank`);
    let pockets = db.get(`${message.guild.id}.${message.author.id}.pockets`);
    let cock = db.get(`${message.guild.id}.${message.author.id}.cock`);
    let cfupgrade = db.get(`${message.guild.id}.${message.author.id}.cfupgrade`);
    if(!bank) bank = 0;
    if(!pockets) pockets = 0;
    if(!cock) cock = false;
    if(!cfupgrade) cfupgrade = 0;

    if(!countdowns[message.author.id]) {
      countdowns[message.author.id] = {
        buycock: 0,
        cockfight: 0,
        crime: 0,
        daily: 0,
        rob: 0,
        slut: 0,
        work: 0
      }
    }

    if(pockets <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

    if(pockets < 300) return message.channel.send(`> :x: You don't have enough coins in your pockets! You need \`300\` coins to buy a cock!`);

    if(cock === true) return message.channel.send(`> :x: You already have a cock! Participate in a cock fight with the command \`${prefix}cockfight <all/amount>\`!`);

    //const random = Math.floor(Math.random() * 84) + 34;

    if(cooldown.has(message.author.id)) {
      var t1 = new Date(countdowns[message.author.id].buycock);
      var t2 = t1.setSeconds(t1.getSeconds() + 30);
      var dif = new Date(t2).getTime() - Date.now();

      var Seconds_from_T1_to_T2 = dif / 1000;
      var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

      const cdembed = new Discord.MessageEmbed()
      .setTitle("🐓 Buy Cock")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` seconds to buy a cock again!
      `)
      .setColor(0xff0000)
      .setFooter("Cooldown: 30 sec in total")
      return message.channel.send(cdembed);
    }

    cooldown.add(message.author.id);

    countdowns[message.author.id].buycock =
    message.createdTimestamp;

    fs.writeFile("./countdowns.json", JSON.stringify(countdowns), err => {
      if(err) console.log(err);
    });

    db.add(`${message.guild.id}.${message.author.id}.pockets`, -300);

    db.set(`${message.guild.id}.${message.author.id}.cock`, true);

    const bc = new Discord.MessageEmbed()
    .setTitle("🐓 Buy Cock")
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`✅ You successfully bought a cock for \`300\` coins!
    `)
    .setColor(0x00ff00)
    .setFooter(`A cock costs 300 coins`)
    message.channel.send(bc);

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, ctime);
  }

  module.exports.help = {
    name: "buycock",
    aliases: ["bc"],
    category: "money"
}