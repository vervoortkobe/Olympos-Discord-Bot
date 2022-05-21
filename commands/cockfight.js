const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const countdowns = require("../countdowns.json");
const cooldown = new Set();
const ctime = 120000;

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

    if(!args[0]) return message.channel.send(`> :x: Usage: ***${prefix}cockfight <amount/all>***`);

    if(pockets <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

    if(!parseInt(args[0]) && !args[0] === "all") return message.channel.send(`> :x: That isn't a valid amount to bet!`);

    if(parseInt(args[0])) {

      if(parseInt(args[0]) > pockets) return message.channel.send(`> :x: You don't have that much money in your pockets!`);

      if(parseInt(args[0]) < 300) return message.channel.send(`> :x: The minimum amount you can bet on a cock fight is \`300\`!`);

      if(cock === false) return message.channel.send(`> :x: You don't have a cock yet! You can buy one with the command \`${prefix}buycock\`!`);

      //const random = Math.floor(Math.random() * 84) + 34;

      if(cooldown.has(message.author.id)) {
        var t1 = new Date(countdowns[message.author.id].cockfight);
        var t2 = t1.setSeconds(t1.getSeconds() + 120);
        var dif = new Date(t2).getTime() - Date.now();

        var Seconds_from_T1_to_T2 = dif / 1000;
        var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

        const cdembed = new Discord.MessageEmbed()
        .setTitle("🐓 Cock Fight")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` seconds to participate in a cock fight again!
        `)
        .setColor(0xff0000)
        .setFooter("Cooldown: 2 min in total")
        return message.channel.send(cdembed);
      }

      cooldown.add(message.author.id);

      countdowns[message.author.id].cockfight =
      message.createdTimestamp;

      fs.writeFile("./countdowns.json", JSON.stringify(countdowns), err => {
        if(err) console.log(err);
      });

      let result = Math.floor((Math.random() * 100));
//0
      if(cfupgrade === 0) {
        if(result >= 0 && result <= 40) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, parseInt(args[0]));

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`✅ Your cock won, so you got paid \`${parseInt(args[0])}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`40% chance to win`)
          message.channel.send(goodcf);
        }
        if(result > 40 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -parseInt(args[0]));

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${args[0]}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`60% chance to lose`)
          message.channel.send(badcf);
        }
      }
//1
      if(cfupgrade === 1) {
        if(result >= 0 && result <= 45) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, parseInt(args[0]));

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`✅ Your cock won, so you got paid \`${parseInt(args[0])}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`45% chance to win`)
          message.channel.send(goodcf);
        }
        if(result > 45 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -parseInt(args[0]));

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${args[0]}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`55% chance to lose`)
          message.channel.send(badcf);
        }
      }
//2
      if(cfupgrade === 2) {
        if(result >= 0 && result <= 50) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, parseInt(args[0]));

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`✅ Your cock won, so you got paid \`${parseInt(args[0])}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`50% chance to win`)
          message.channel.send(goodcf);
        }
        if(result > 50 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -parseInt(args[0]));

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${args[0]}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`50% chance to lose`)
          message.channel.send(badcf);
        }
      }
//3
      if(cfupgrade === 3) {
        if(result >= 0 && result <= 55) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, parseInt(args[0]));

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`✅ Your cock won, so you got paid \`${parseInt(args[0])}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`55% chance to win`)
          message.channel.send(goodcf);
        }
        if(result > 55 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -parseInt(args[0]));

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${args[0]}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`45% chance to lose`)
          message.channel.send(badcf);
        }
      }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////

    if(args[0] === "all") {
      
      if(pockets < 300) return message.channel.send(`> :x: The minimum amount you can bet on a cock fight is \`300\`!`);

      if(cock === false) return message.channel.send(`> :x: You don't have a cock yet! You can buy one with the command \`${prefix}buycock\`!`);

      //const random = Math.floor(Math.random() * 84) + 34;

      if(cooldown.has(message.author.id)) {
        var t1 = new Date(countdowns[message.author.id].cockfight);
        var t2 = t1.setSeconds(t1.getSeconds() + 120);
        var dif = new Date(t2).getTime() - Date.now();

        var Seconds_from_T1_to_T2 = dif / 1000;
        var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

        const cdembed = new Discord.MessageEmbed()
        .setTitle("🐓 Cock Fight")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` seconds to participate in a cock fight again!
        `)
        .setColor(0xff0000)
        .setFooter("Cooldown: 2 min in total")
        return message.channel.send(cdembed);
      }

      cooldown.add(message.author.id);

      let result = Math.floor((Math.random() * 100));
//0
      if(cfupgrade === 0) {

        if(result >= 0 && result <= 40) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`✅ Your cock won, so you got paid \`${pockets}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`40% chance to win`)
          message.channel.send(goodcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, pockets);
        }
        if(result > 40 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${pockets}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`60% chance to lose`)
          message.channel.send(badcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -pockets);

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);
        }
      }
//1
      if(cfupgrade === 1) {

        if(result >= 0 && result <= 45) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`✅ Your cock won, so you got paid \`${pockets}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`45% chance to win`)
          message.channel.send(goodcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, personscoins);
        }
        if(result > 45 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${pockets}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`55% chance to lose`)
          message.channel.send(badcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -pockets);

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);
        }
      }
//2
      if(cfupgrade === 2) {
        
        if(result >= 0 && result <= 50) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`✅ Your cock won, so you got paid \`${pockets}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`50% chance to win`)
          message.channel.send(goodcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, pockets);
        }
        if(result > 50 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${pockets}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`50% chance to lose`)
          message.channel.send(badcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -pockets);

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);
        }
      }
//3
      if(cfupgrade === 3) {
        
        if(result >= 0 && result <= 55) {
          
          //const goodrandom = Math.floor(Math.random() * 82) + 790;

          const goodcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`✅ Your cock won, so you got paid \`${pockets}\` coins!
          `)
          .setColor(0x00ff00)
          .setFooter(`55% chance to win`)
          message.channel.send(goodcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, pockets);
        }
        if(result > 55 && result <= 100) {

          //const badrandom = Math.floor(Math.random() * 46) + 634;

          const badcf = new Discord.MessageEmbed()
          .setTitle("🐓 Cock Fight")
          .setDescription(`:x: The other cock won and your cock died, so you have to pay \`${pockets}\` coins!
          `)
          .setColor(0xff0000)
          .setFooter(`45% chance to lose`)
          message.channel.send(badcf);

          db.add(`${message.guild.id}.${message.author.id}.pockets`, -pockets);

          db.set(`${message.guild.id}.${message.author.id}.cock`, false);
        }
      }
    }

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, ctime);
  }

  module.exports.help = {
    name: "cockfight",
    aliases: ["cf"],
    category: "money"
}