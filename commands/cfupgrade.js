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

    if(!args[0] || !args[0] === "1" || !args[0] === "2" || !args[0] === "3") {
      const noargs = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle("🐓 Cock Fight Upgrade")
      .setDescription(`> :x: Usage: ***${prefix}cfupgrade <1/2/3>***`)
      .addField(`Item`, `
      \`\`\`md
      \n• 1️⃣ Cockfight Upgr 1
      \n• 2️⃣ Cockfight Upgr 2
      \n• 3️⃣ Cockfight Upgr 3
      \`\`\`
      `, true)
      .addField(`Prize`, `
      \`\`\`js
      \n5k coins
      \n10k coins
      \n15k coins
      \`\`\`
      `, true)
      .addField(`CF Chance of luck`, `
      \`\`\`js
      \n45%
      \n50%
      \n55%
      \`\`\`
      `, true)
      return message.channel.send(noargs);
    }

    if(args[0] === "1") {

      if(cfupgrade === 1) return message.channel.send(`> :x: You already bought Cock Fight Upgrade \`1️⃣\`!`);

      if(cfupgrade === 2) return message.channel.send(`> :x: You already bought Cock Fight Upgrade \`2️⃣\`!`);

      if(cfupgrade === 3) return message.channel.send(`> :x: You already bought Cock Fight Upgrade \`3️⃣\`!`);

      if(pockets <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

      if(pockets < 5000) return message.channel.send(`> :x: You don't have enough coins in your pockets! You need \`5000\` coins to buy Cock Fight Upgrade \`1️⃣\`!`);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -5000);

      db.set(`${message.guild.id}.${message.author.id}.cfupgrade`, 1);

      const bc = new Discord.MessageEmbed()
      .setTitle("🐓 Cock Fight Upgrade")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`✅ You successfully bought Cock Fight Upgrade \`1️⃣\` for \`5000\` coins!
      \n• When using the \`${prefix}cockfight\` command, you will have a \`45%\` chance of being lucky instead of \`40%\`!
      `)
      .setColor(0x00ff00)
      .setFooter(`Upgrade 1: 45%, Upgrade 2: 50%, Upgrade 3: 55%`)
      message.channel.send(bc);
    }

    if(args[0] === "2") {
      
      if(cfupgrade === 0) return message.channel.send(`> :x: You have to buy Cock Fight Upgrade \`1️⃣\` before buying Cock Fight Upgrade \`2️⃣\`!`);

      if(cfupgrade === 2) return message.channel.send(`> :x: You already bought Cock Fight Upgrade \`2️⃣\`!`);

      if(cfupgrade === 3) return message.channel.send(`> :x: You already bought Cock Fight Upgrade \`3️⃣\`!`);

      if(pockets <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

      if(pockets < 10000) return message.channel.send(`> :x: You don't have enough coins in your pockets! You need \`10000\` coins to buy Cock Fight Upgrade \`2️⃣\`!`);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -10000);

      db.set(`${message.guild.id}.${message.author.id}.cfupgrade`, 2);

      const bc = new Discord.MessageEmbed()
      .setTitle("🐓 Cock Fight Upgrade")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`✅ You successfully bought Cock Fight Upgrade \`2️⃣\` for \`10000\` coins!
      \n• When using the \`${prefix}cockfight\` command, you will have a \`50%\` chance of being lucky instead of \`45%\`!
      `)
      .setColor(0x00ff00)
      .setFooter(`Upgrade 1: 45%, Upgrade 2: 50%, Upgrade 3: 55%`)
      message.channel.send(bc);
    }

    if(args[0] === "3") {
      
      if(cfupgrade === 0) return message.channel.send(`> :x: You have to buy Cock Fight Upgrade \`1️⃣\` before buying Cock Fight Upgrade \`3️⃣\`!`);

      if(cfupgrade === 1) return message.channel.send(`> :x: You have to buy Cock Fight Upgrade \`2️⃣\` before buying Cock Fight Upgrade \`3️⃣\`!`);

      if(cfupgrade === 3) return message.channel.send(`> :x: You already bought Cock Fight Upgrade \`3️⃣\`!`);

      if(pockets <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

      if(pockets < 15000) return message.channel.send(`> :x: You don't have enough coins in your pockets! You need \`15000\` coins to buy Cock Fight Upgrade \`3️⃣\`!`);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -15000);

      db.set(`${message.guild.id}.${message.author.id}.cfupgrade`, 3);

      const bc = new Discord.MessageEmbed()
      .setTitle("🐓 Cock Fight Upgrade")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`✅ You successfully bought Cock Fight Upgrade \`3️⃣\` for \`15000\` coins!
      \n• When using the \`${prefix}cockfight\` command, you will have a \`55%\` chance of being lucky instead of \`50%\`!
      `)
      .setColor(0x00ff00)
      .setFooter(`Upgrade 1: 45%, Upgrade 2: 50%, Upgrade 3: 55%`)
      message.channel.send(bc);
    }
  }

  module.exports.help = {
    name: "cfupgrade",
    aliases: ["cfupgr"],
    category: "money"
}