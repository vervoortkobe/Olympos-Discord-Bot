const Discord = require("discord.js");
const fs = require("fs");
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!message.member.permissions.has("MANAGE_ROLES")) {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***I couldn't delete this user's warnings, you don't have the correct permissions (MANAGE_ROLES) to do this!***`)
      return message.channel.send(errorEmbed);
    }

    if(!args[0]) {
      const usageEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setTitle(`⚙️ | Delwarns`)
      .setDescription(`:x: **|** ***Usage: ${prefix}delwarns <@user/user ID>***`)
      return message.channel.send(usageEmbed);
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) {

      let warnInfo = db.fetch(`info.${message.guild.id}.${args[0]}`);

      if(!warnInfo) {
        const noWarningsEmbed = new Discord.MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`:x: **|** ***This user doesn't have any warnings to delete!***`)
        return message.channel.send(noWarningsEmbed);

      } else {

        for(let warnings of warnInfo) {
          let date = warnings.date;
          let warnedby = warnings.warnedby;
          let reason = warnings.reason;

          message.delete();
  
          const delwarnsEmbed = new Discord.MessageEmbed()
          .setColor(0x00ff00)
          .setDescription(`:white_check_mark: **|** ***\`${args[0]}\`'s warnings have been deleted!***`)
          message.channel.send(delwarnsEmbed);

          const logChannel = message.guild.channels.cache.find(c => c.name === `rex-logs`);
          if(logChannel) {
            const delwarnsLogEmbed = new Discord.MessageEmbed()
            .setColor(0x96ddff)
            .setTitle(`⚙️ | Logs`)
            .setThumbnail(useravatar)
            .setDescription(`**• USER_WARNINGS_DELETED:**
            \n${message.author} **deleted \`${args[0]}\`'s warnings!**
            `)
            logChannel.send(delwarnsLogEmbed);
          }
        }
    
        db.delete(`info.${message.guild.id}.${args[0]}`);
      }
    }

    let warnInfo = db.fetch(`info.${message.guild.id}.${member.id}`);

    if(!warnInfo) {
      const noWarningsEmbed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .setDescription(`:x: **|** ***${member} doesn't have any warnings to delete!***`)
      return message.channel.send(noWarningsEmbed);

    } else {

      message.delete();

      const delwarnsEmbed = new Discord.MessageEmbed()
      .setColor(0x00ff00)
      .setDescription(`:white_check_mark: **|** ***${member}'s warnings have been deleted!***`)
      message.channel.send(delwarnsEmbed);

      db.delete(`info.${message.guild.id}.${member.id}`);
      
      const logChannel = message.guild.channels.cache.find(c => c.name === `rex-logs`);
      if(logChannel) {
        const delwarnsLogEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`⚙️ | Logs`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`**• USER_WARNINGS_DELETED:**
        \n**${member}'s warnings have been deleted!**
        `)
        logChannel.send(delwarnsLogEmbed);
      }
    }
  }

  module.exports.help = {
    name: "delwarns",
    aliases: ["delwarnings"],
    category: "mod"
}