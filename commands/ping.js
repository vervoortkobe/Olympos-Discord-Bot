const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    const mEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setDescription(`⚙️ **|** ***Calculating...***`)

    const m = await message.channel.send(mEmbed);

    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const pingEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setAuthor(`🏓 | Ping`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`***Pong!***
    \n> 💬 **| Latency:** \`${m.createdTimestamp - message.createdTimestamp}\`**ms**
    > ⚙️ **| Discord API:** \`${Math.round(client.ws.ping)}\`**ms**
    \n> 💻 **| Uptime:** \`${uptime}\`
    `)
    m.edit(pingEmbed);
  }

  module.exports.help = {
    name: "ping",
    aliases: [],
    category: "about"
}