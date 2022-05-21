const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.member.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't start a giveaway, because you don't have the correct permissions (MANAGE_ROLES) to do this!***`)
      return message.channel.send(errorEmbed);
    }

    message.delete();

    fs.writeFile("./giveaway.json", JSON.stringify([]), err => {
      if(err) console.log(err);
    });

    const giveawayEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`🎉 Giveaway`)
    .setThumbnail(message.guild.iconURL())
    .setDescription(`• Do you want to receive \`500\` coins for **free**?
    \n• React with the \`✅\` reaction on this message!
    `)
    message.channel.send(giveawayEmbed)
    .then(m => m.react("✅"));
  }

  module.exports.help = {
    name: "giveaway",
    aliases: [],
    category: "owner"
}