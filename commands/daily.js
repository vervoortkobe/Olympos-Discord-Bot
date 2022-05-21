const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const countdowns = require("../countdowns.json");
const cooldown = new Set();
const ctime = 28800000;

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

    const random = Math.floor(Math.random() * 550) + 200;

    if(cooldown.has(message.author.id)) {
      var t1 = new Date(countdowns[message.author.id].daily);
      var t2 = t1.setSeconds(t1.getSeconds() + 28800);
      var dif = new Date(t2).getTime() - Date.now();

      var Seconds_from_T1_to_T2 = dif / 1000 / 60 / 60;
      var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

      const cdembed = new Discord.MessageEmbed()
      .setTitle("💰 Daily")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` hours to claim your daily reward again!
      `)
      .setColor(0xff0000)
      .setFooter("Cooldown: 8 hours in total")
      return message.channel.send(cdembed);
    }

    db.add(`${message.guild.id}.${message.author.id}.pockets`, random);

    cooldown.add(message.author.id);

    countdowns[message.author.id].daily =
    message.createdTimestamp;

    fs.writeFile("./countdowns.json", JSON.stringify(countdowns), err => {
      if(err) console.log(err);
    });

    const daily = new Discord.MessageEmbed()
    .setTitle("💰 Daily")
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`✅ You successfully claimed your daily reward of \`${random}\` coins!
    `)
    .setColor(0x00ff00);
    message.channel.send(daily);

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, ctime);
  }

  module.exports.help = {
    name: "daily",
    aliases: [],
    category: "money"
}