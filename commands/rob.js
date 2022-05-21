const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const countdowns = require("../countdowns.json");
const cooldown = new Set();
const ctime = 420000;

module.exports.run = async (client, message, args) => {

    if(!args[0]) return message.channel.send(`> :x: Usage: ***${prefix}rob <@member/member ID>***`);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`:x: Please mention a valid member of this server!`);

    let bank = db.get(`${message.guild.id}.${message.author.id}.bank`);
    let pockets = db.get(`${message.guild.id}.${message.author.id}.pockets`);
    let cock = db.get(`${message.guild.id}.${message.author.id}.cock`);
    let cfupgrade = db.get(`${message.guild.id}.${message.author.id}.cfupgrade`);
    if(!bank) bank = 0;
    if(!pockets) pockets = 0;
    if(!cock) cock = false;
    if(!cfupgrade) cfupgrade = 0;

    let membersbank = db.get(`${message.guild.id}.${member.id}.bank`);
    let memberspockets = db.get(`${message.guild.id}.${member.id}.pockets`);
    let memberscock = db.get(`${message.guild.id}.${member.id}.cock`);
    let memberscfupgrade = db.get(`${message.guild.id}.${member.id}.cfupgrade`);
    if(!membersbank) membersbank = 0;
    if(!memberspockets) memberspockets = 0;
    if(!memberscock) memberscock = false;
    if(!memberscfupgrade) memberscfupgrade = 0;

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

    if(memberspockets <= 1000) return message.channel.send(`> :x: This member doesn't have any coins to give!`);

    //const random = Math.floor(Math.random() * 84) + 34;

    if(cooldown.has(message.author.id)) {
      var t1 = new Date(countdowns[message.author.id].rob);
      var t2 = t1.setSeconds(t1.getSeconds() + 420);
      var dif = new Date(t2).getTime() - Date.now();

      var Seconds_from_T1_to_T2 = dif / 1000;
      var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

      const cdembed = new Discord.MessageEmbed()
      .setTitle("👮 Rob")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` seconds to rob someone again!
      `)
      .setColor(0xff0000)
      .setFooter("Cooldown: 7 min in total")
      return message.channel.send(cdembed);
    }

    cooldown.add(message.author.id);

    countdowns[message.author.id].rob =
    message.createdTimestamp;

    fs.writeFile("./countdowns.json", JSON.stringify(countdowns), err => {
      if(err) console.log(err);
    });

    let result = Math.floor((Math.random() * 100));
    if(result >= 0 && result <= 45) {
      
      const goodrandom = Math.floor(Math.random() * 82) + 490;

      db.add(`${message.guild.id}.${message.author.id}.pockets`, goodrandom);

      db.add(`${message.guild.id}.${member.id}.pockets`, -goodrandom);

      const goodrob = new Discord.MessageEmbed()
      .setTitle("👮 Rob")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`✅ You successfully robbed ${member} and got paid \`${goodrandom}\` coins!
      `)
      .setColor(0x00ff00)
      .setFooter(`45% chance to rob someone successfully`)
      message.channel.send(goodrob);
    }
    if(result > 55 && result <= 100) {

      const badrandom = Math.floor(Math.random() * 46) + 534;

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -badrandom);

      const badrob = new Discord.MessageEmbed()
      .setTitle("👮 Rob")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`:x: The police caught you while you were trying to rob ${member}, so you got fined \`${badrandom}\` coins!
      `)
      .setColor(0xff0000)
      .setFooter(`55% chance to rob someone and get caught`)
      message.channel.send(badrob);
    }

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, ctime);
  }

  module.exports.help = {
    name: "rob",
    aliases: [],
    category: "money"
}