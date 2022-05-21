const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const moment = require("moment");

module.exports.run = async (client, message, args) => {

    if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't warn this member, because I don't have permissions to manage messages!***`)
      return message.channel.send(errorEmbed);
    }

    if(!message.member.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't warn this member, you don't have the correct permissions (MANAGE_ROLES) to do this!***`)
      return message.channel.send(errorEmbed);
    }

    if(!args[0]) {
      const usageEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`⚙️ | Warn`)
      .setDescription(`:x: **|** ***Usage: ${prefix}warn <@member/member ID> [reason]***`)
      .setFooter(`<> = required | [] = optional`)
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
      .setDescription(`:x: **|** ***You can't warn yourself!***`)
      return message.channel.send(errorEmbed);
    }
    
    if(member.bot) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't warn a bot!***`)
      return message.channel.send(errorEmbed);
    }
    
    if(member.kickable === false) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't warn this member! Does he/she have a higher role than me?***`)
      return message.channel.send(errorEmbed);
    }

    let reason = args.slice(1).join(" ");
    if(!reason) reason = "No reason given";

    message.delete();

    const warnEmbed = new Discord.MessageEmbed()
    .setColor(0x00ff00)
    .setDescription(`:white_check_mark: **|** ***${member} has been warned!***`)
    message.channel.send(warnEmbed);

    db.push(`info.${message.guild.id}.${member.id}`, { date: moment().format("DD-MM-YYYY"), warnedby: message.author.id, reason: reason });

    const warnPmEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`⚠️ | Warned`)
    .setThumbnail(message.guild.iconURL())
    .setDescription(`You were warned in \`${message.guild.name}\`, because of \`${reason}\`!
    \n**• Server:** \`${message.guild.name}\`
    \n**• Punishment:** \`Warning\`
    \n**• Reason:** \`${reason}\`
    `)
    member.send(warnPmEmbed)
    .catch(err => console.log(err));

    const logChannel = message.guild.channels.cache.find(c => c.name === `olympos-logs`);
    if(logChannel) {
      const warnLogEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`⚙️ | Logs`)
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(`**• MEMBER_WARN:**
      \n${message.author} **warned ${member}, because of ${reason}**!
      `)
      logChannel.send(warnLogEmbed);
    }
  }

  module.exports.help = {
    name: "warn",
    aliases: [],
    category: "mod"
}