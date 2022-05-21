const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.guild.me.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't unlock this member, because I don't have permissions to manage roles!***`)
      return message.channel.send(errorEmbed);
    }

    if(!message.member.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't mute this member, you don't have the correct permissions (MANAGE_ROLES) to do this!***`)
      return message.channel.send(errorEmbed);
    }

    if(!args[0]) {
      const usageEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`⚙️ Mute`)
      .setDescription(`:x: **|** ***Usage: ${prefix}mute <@member/member ID> <reason>***`)
      return message.channel.send(usageEmbed);
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
    let vcmuteRole = message.guild.roles.cache.find(r => r.name === "VC Muted");
    let chatRole = message.guild.roles.cache.find(r => r.name === "Chat");
    let vcRole = message.guild.roles.cache.find(r => r.name === "VC");

    if(!member) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***Please mention a valid member!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.id === message.author.id) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't mute yourself!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.bot) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***You can't mute a bot!!***`)
      return message.channel.send(errorEmbed);
    }

    if(member.kickable === false) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't mute this member! Does he/she have a higher role than me?***`)
      return message.channel.send(errorEmbed);
    }
    
    if(member.roles.cache.has(muteRole)) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't mute this member, because he/she is already muted!***`)
      return message.channel.send(errorEmbed);
      
    } else {

    if(!muteRole) console.log("no muted role found!");
    member.roles.add(muteRole);
    if(!vcmuteRole) console.log("no vcmute role found!");
    member.roles.add(vcmuteRole);
    if(!chatRole) console.log("no chat role found!");
    member.roles.remove(chatRole);
    if(!vcRole) console.log("no vc role found!");
    member.roles.remove(vcRole);
      
    let reason = args.slice(1).join(" ");
    if(!reason) reason = "no reason given";

    message.delete();

    const muteEmbed = new Discord.MessageEmbed()
    .setColor(0x00ff00)
    .setDescription(`:white_check_mark: **|** ***${member} has been muted!***`)
    message.channel.send(muteEmbed);

    const mutePmEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`⛑️ Muted`)
    .setThumbnail(message.guild.iconURL())
    .setDescription(`You were \`muted\` on \`${message.guild.name}\`, because of \`${reason}\`!
    \n**» Server:** \`${message.guild.name}\`
    \n**» Punishment:** \`Mute\`
    \n**» Reason:** \`${reason}\`
    `)
    member.send(mutePmEmbed);

    const logChannel = message.guild.channels.cache.find(c => c.name === `olympos-logs`);
    if(!logChannel) return;

    const muteLogEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle(`⚙️ Logs`)
    .setThumbnail(member.user.displayAvatarURL())
    .setDescription(`**• MEMBER_MUTE:**
    \n${message.author} **muted ${member}, because of ${reason}**!`)
    logChannel.send(muteLogEmbed);
    }
  }

  module.exports.help = {
    name: "mute",
    aliases: [],
    category: "mod"
}