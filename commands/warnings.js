const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't check this user's warnings, because I don't have permissions to manage messages!***`)
      return message.channel.send(errorEmbed);
    }

    if(!message.member.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't check this user's warnings, you don't have the correct permissions (MANAGE_ROLES) to do this!***`)
      return message.channel.send(errorEmbed);
    }
    
    if(!args[0]) {
      const usageEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`⚙️ | Warnings`)
      .setDescription(`:x: **|** ***Usage: ${prefix}warnings <@user/user ID>***`)
      return message.channel.send(usageEmbed);
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) {
      let warnInfo = db.fetch(`info.${message.guild.id}.${args[0]}`);

      if(!warnInfo) {
        const noWarningsEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`⚠️ | Warnings`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`:x: **|** ***This user doesn't have any warnings yet!***`)
        return message.channel.send(noWarningsEmbed);
      }
  
      const warningsEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`⚠️ | Warnings`)
      .setThumbnail(message.guild.iconURL())
  
      for(let warnings of warnInfo) {
        let date = warnings.date;
        let warnedby = warnings.warnedby;
        let reason = warnings.reason;
  
        warningsEmbed.addField(`\`${args[0]}\``, `Date: \`${date}\`\nWarned By: <@${warnedby}>\nReason: \`${reason}\``, true);
      }
  
      message.react("⚠️");

      return message.channel.send(warningsEmbed)
      .catch(err => {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`:x: **|** ***This user has too many warnings to display!***`)
        return message.channel.send(errorEmbed);
      });
    }

    let warnInfo = db.fetch(`info.${message.guild.id}.${member.id}`);

    if(!warnInfo) {
      const noWarningsEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`⚠️ | Warnings`)
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(`:x: **|** ***This user doesn't have any warnings yet!***`)
      return message.channel.send(noWarningsEmbed);
    }

    const warningsEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`⚠️ | Warnings`)
    .setThumbnail(member.user.displayAvatarURL())

    for(let warnings of warnInfo) {
      let date = warnings.date;
      let warnedby = warnings.warnedby;
      let reason = warnings.reason;

      warningsEmbed.addField(`\`${member.user.tag}\``, `Date: \`${date}\`\nWarned By: <@${warnedby}>\nReason: \`${reason}\``, true);
    }

    message.react("⚠️");

    message.channel.send(warningsEmbed)
    .catch(err => {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***This user has too many warnings to display!***`)
      return message.channel.send(errorEmbed);
    });
  }

  module.exports.help = {
    name: "warnings",
    aliases: ["warns", "infractions"],
    category: "mod"
}