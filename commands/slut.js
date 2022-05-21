const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const countdowns = require("../countdowns.json");
const cooldown = new Set();
const ctime = 300000;

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

    //const random = Math.floor(Math.random() * 84) + 34;

  if(cooldown.has(message.author.id)) {
      var t1 = new Date(countdowns[message.author.id].slut);
      var t2 = t1.setSeconds(t1.getSeconds() + 300);
      var dif = new Date(t2).getTime() - Date.now();

      var Seconds_from_T1_to_T2 = dif / 1000;
      var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

      const cdembed = new Discord.MessageEmbed()
      .setTitle("💦 Slut")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` seconds to be a slut again!
      `)
      .setColor(0xff0000)
      .setFooter("Cooldown: 5 min in total")
      return message.channel.send(cdembed);
    }

    cooldown.add(message.author.id);

    countdowns[message.author.id].slut =
    message.createdTimestamp;

    fs.writeFile("./countdowns.json", JSON.stringify(countdowns), err => {
      if(err) console.log(err);
    });

    let result = Math.floor((Math.random() * 100));
    if(result >= 0 && result <= 60) {
      
      const goodrandom = Math.floor(Math.random() * 84) + 290;

      db.add(`${message.guild.id}.${message.author.id}.pockets`, goodrandom);

      const goodslut = new Discord.MessageEmbed()
      .setTitle("💦 Slut")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`✅ You were a good slut and got paid \`${goodrandom}\` coins!
      `)
      .setColor(0x00ff00)
      .setFooter(`60% chance to be a good slut`)
      message.channel.send(goodslut);
    }
    if(result > 60 && result <= 100) {

      const badrandom = Math.floor(Math.random() * 8) + 234;

      db.add(`${message.guild.id}.${message.author.id}.pockets`, badrandom);

      const badslut = new Discord.MessageEmbed()
      .setTitle("💦 Slut")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`:x: You were a bad slut and got fined \`${badrandom}\` coins!
      `)
      .setColor(0xff0000)
      .setFooter(`40% chance to be a bad slut`)
      message.channel.send(badslut);
    }

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, ctime);
  }

  module.exports.help = {
    name: "slut",
    aliases: [],
    category: "money"
}