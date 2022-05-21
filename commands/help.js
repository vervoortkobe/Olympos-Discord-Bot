const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    const helpEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`🤖 Help`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`***• My prefix is \`${prefix}\`!***
    \n***• Check the shop with the command \`${prefix}shop\`!***
    `)
    .setDescription(`• \`⛑ Moderation (6)\`\n• \`💸 Money (17)\`\n• \`😂 Fun (4)\`\n• \`📁 Other (2)\`\n• \`🎧 Music (10)\`\n• \`ℹ️ About (1)\``)
    message.channel.send(helpEmbed)
    .then(m => {
      m.react("🤖");
      m.react("⛑");
      m.react("💸");
      m.react("😂");
      m.react("📁");
      m.react("🎧");
      m.react("ℹ️");
    });
  }

  module.exports.help = {
    name: "help",
    aliases: [],
    category: ""
}