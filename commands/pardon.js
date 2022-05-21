const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't pardon this member, because I don't have permissions to manage messages!***`)
      return message.channel.send(errorEmbed);
    }

    if(!message.member.permissions.has("MANAGE_MESSAGES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't pardon this member, because you don't have the correct permissions (MANAGE_MESSAGES) to do this!***`)
      return message.channel.send(errorEmbed);
    }

    if(!args[0]) {
      const usageEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`⚙️ Pardon`)
      .setDescription(`:x: **|** ***Usage: ${prefix}pardon <@member/member ID> <reason>***`)
      return message.channel.send(usageEmbed);
    }
    
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***Please mention a valid member!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.id === message.author.id) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't pardon yourself!***`)
      return message.channel.send(errorEmbed);
    }
    
    if(member.bot) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't pardon a bot!***`)
      return message.channel.send(errorEmbed);
    }
    
    if(member.kickable === false) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't pardon this member! Does he/she have a higher role than me?***`)
      return message.channel.send(errorEmbed);
    }

    let reason = args.slice(1).join(" ");
    if(!reason) reason = "no reason given";

    message.delete();

    const pardonEmbed = new Discord.MessageEmbed()
    .setColor(0x00ff00)
    .setDescription(`:white_check_mark: **|** ***${member} has been pardoned!***`)
    message.channel.send(pardonEmbed);

    const pardonPmEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`😕 Pardoned`)
    .setThumbnail(message.guild.iconURL())
    .setDescription(`You were pardoned in \`${message.guild.name}\`, by ${message.author}, because of \`${reason}\`!
    \n**» Server:** \`${message.guild.name}\`
    \n**» Pardoned By:** ${message.author}
    \n**» Reason:** \`${reason}\`
    `)
    member.send(pardonPmEmbed);

    const logChannel = message.guild.channels.cache.find(c => c.name === `olympos-logs`);
    if(!logChannel) return;

    const pardonLogEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`⚙️ Logs`)
    .setThumbnail(member.user.displayAvatarURL())
    .setDescription(`**• MEMBER_PARDON:**
    \n${message.author} **pardoned ${member}, because of ${reason}**!
    `)
    return logChannel.send(pardonLogEmbed);
  }

  module.exports.help = {
    name: "pardon",
    aliases: [],
    category: "mod"
}