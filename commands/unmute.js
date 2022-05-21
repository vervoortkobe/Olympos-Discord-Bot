const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't unmute this member, because I don't have permissions to manage roles!***`)
      return message.channel.send(errorEmbed);
    }

    if(!message.member.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't unmute this member, you don't have the correct permissions (MANAGE_ROLES) to do this!***`)
      return message.channel.send(errorEmbed);
    }
    
    if(!args[0]) {
      const usageEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`⚙️ Unmute`)
      .setDescription(`:x: **|** ***Usage: ${prefix}unmute <@member/member ID>***`)
      return message.channel.send(usageEmbed);
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
    let chatRole = message.guild.roles.cache.find(r => r.name === "Chat");
    
    if(!member) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***Please mention a valid member!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.id === message.author.id) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't unmute yourself!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.bot) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't unmute a bot!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.kickable === false) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't unmute this member! Does he/she have a higher role than me?***`)
      return message.channel.send(errorEmbed);
    }
    
    if(!member.roles.cache.has(muteRole)) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't unmute this member, because he/she isn't muted!***`)
      return message.channel.send(errorEmbed);

    } else {

      if(!muteRole) console.log("no mute role found!");
      member.roles.remove(muteRole);
      if(!chatRole) console.log("no chat role found!");
      member.roles.add(chatRole);

      message.delete();

      const unmuteEmbed = new Discord.MessageEmbed()
      .setColor(0x00ff00)
      .setDescription(`:white_check_mark: **|** ***${member} has been unmuted!***`)
      message.channel.send(unmuteEmbed);

      const unmutePmEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`⛑️ Unmuted`)
      .setThumbnail(message.guild.iconURL())
      .setDescription(`You were \`unmuted\` on \`${message.guild.name}\`!
      \n**» Server:** \`${message.guild.name}\``)
      member.send(unmutePmEmbed);

      const logChannel = message.guild.channels.cache.find(c => c.name === `olympos-logs`);
      if(!logChannel) return;

      const unmuteLogEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle(`⚙️ Logs`)
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(`**• MEMBER_UNMUTE:**
      \n${message.author} **unmuted ${member}**!
      `)
      logChannel.send(unmuteLogEmbed);
    }
  }

  module.exports.help = {
    name: "unmute",
    aliases: [],
    category: "mod"
}