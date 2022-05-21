const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    const shopEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`🛒 Shop`)
    .setThumbnail(client.user.displayAvatarURL())
    .addField(`Item`, `
    \`\`\`md
    \n• 🐓 Cock
    \n• 1️⃣ Cf Upgrade 1
    \n• 2️⃣ Cf Upgrade 2
    \n• 3️⃣ Cf Upgrade 3
    \n• Gambler
    \n• Dicer
    \n• Card Dealer
    \n• Shuffler
    \n• Megaslut
    \n• Risktaker
    \n• Highroller
    \n• Poker Master
    \n• Millionaire
    \`\`\`
    `, true)
    .addField(`Prize`, `
    \`\`\`js
    \n300 coins
    \n5k coins
    \n10k coins
    \n15k coins
    \n25k coins
    \n50k coins
    \n75k coins
    \n100k coins
    \n125k coins
    \n150k coins
    \n175k coins
    \n200k coins
    \n1m coins
    \`\`\`
    `, true)
    .addField(`Command`, `
    \`\`\`
    \n${prefix}buycock
    \n${prefix}cfupgrade 1
    \n${prefix}cfupgrade 2
    \n${prefix}cfupgrade 3
    \n${prefix}cr gambler
    \n${prefix}cr dicer
    \n${prefix}cr carddealer
    \n${prefix}cr shuffler
    \n${prefix}cr megaslut
    \n${prefix}cr risktaker
    \n${prefix}cr highroller
    \n${prefix}cr pokermaster
    \n${prefix}cr millionaire
    \`\`\`
    `, true)
    message.channel.send(shopEmbed);
  }

  module.exports.help = {
    name: "shop",
    aliases: [],
    category: "money"
}