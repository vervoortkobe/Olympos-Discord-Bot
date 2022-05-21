const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't purge these messages, because I don't have permissions to manage messages!***`)
      return message.channel.send(errorEmbed);
    }

    if(!message.member.permissions.has("MANAGE_MESSAGES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't purge these messages, you don't have the correct permissions (MANAGE_MESSAGES) to do this!***`)
      return message.channel.send(errorEmbed);
    }

    if(!args[0]) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***Please define the amount of messages to purge!***`)
      return message.channel.send(errorEmbed);
    }

    if(Number.isInteger(parseInt(args[0]))) {
      if(parseInt(args[0]) < 100) {

        var amount = parseInt(args[0]) + 1;

        message.channel.bulkDelete(amount);

        const purgeEmbed = new Discord.MessageEmbed()
        .setColor(0x00ff00)
        .setDescription(`:white_check_mark: **|** ***${message.author} purged \`${amount - 1}\` messages!***`)
        message.channel.send(purgeEmbed).then(m => m.delete({ timeout: 5000} ));

        const logChannel = message.guild.channels.cache.find(c => c.name === `olympos-logs`);
        if(!logChannel) return;
            
        const purgeLogEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`⚙️ Logs`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`**• MESSAGES_PURGED:**
        \n**${message.author} purged \`${amount - 1}\` messages in ${message.channel}**!
        `)
        logChannel.send(purgeLogEmbed);
        
      } else {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`:x: **|** ***You can't purge more than \`99\` messages!***`)
        return message.channel.send(errorEmbed);
      }

    } else {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***Please define the amount of messages to purge!***`)
      return message.channel.send(errorEmbed);
    }
  }

  module.exports.help = {
    name: "purge",
    aliases: ["clear"],
    category: "mod"
}