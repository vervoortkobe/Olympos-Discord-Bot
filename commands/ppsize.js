const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let replies = ["8=D", "8=D", "8=D", "8=D", "8=D", "8=D", "8=D", "8=D", "8=D", "8=D", "8==D", "8==D", "8==D", "8==D", "8==D", "8==D", "8==D", "8==D", "8==D", "8===D", "8===D", "8===D", "8===D", "8===D", "8===D", "8===D", "8===D", "8====D", "8====D", "8====D", "8====D", "8====D", "8====D", "8====D", "8=====D", "8=====D", "8=====D", "8=====D", "8=====D", "8=====D", "8======D", "8======D", "8======D", "8======D", "8======D", "8=======D", "8=======D", "8=======D", "8=======D", "8========D", "8========D", "8========D", "8=========D", "8=========D", "8==========D"];
    let result = Math.floor((Math.random() * replies.length));

    if(!args[0]) {
      const ppsizeEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`8=D | PPsize Machine`)
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`**${message.author}'s pp:**
      \n\`\`\`${replies[result]}\`\`\``)
      return message.channel.send(ppsizeEmbed);
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) {
      const ppsizeEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`😳 | PPsize Machine`)
      .setThumbnail("https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png")
      .setDescription(`**${args.join(" ")}'s pp:**
      \n\`\`\`${replies[result]}\`\`\``)
      return message.channel.send(ppsizeEmbed);
    }

    const ppsizeEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`😳 | PPsize Machine`)
    .setThumbnail(member.user.displayAvatarURL())
    .setDescription(`**${member}'s pp:**
    \n\`\`\`${replies[result]}\`\`\``)
    message.channel.send(ppsizeEmbed);
  }

  module.exports.help = {
  name: "ppsize",
  aliases: [],
  category: "fun"
}