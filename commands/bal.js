const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let differarr = [];
    message.guild.members.cache.forEach(user => {
      differarr.push(user.id);
    });

    let allmemberlength = differarr.length;

    let mesarr = [];

    for(let i = 0; i < allmemberlength; i++) {
      let gettheamount = db.get(`${message.guild.id}.${differarr[i]}`);

      let theamount;
      if(gettheamount) {
        theamount = gettheamount.bank;
      } else {
        theamount = 0;
      }

      mesarr.push({
        name: differarr[i],
        amount: theamount
      });
    }

    mesarr.sort((a, b) => b.amount - a.amount);

    if(!args[0]) {
      let bank = db.get(`${message.guild.id}.${message.author.id}.bank`);
      let pockets = db.get(`${message.guild.id}.${message.author.id}.pockets`);
      let cock = db.get(`${message.guild.id}.${message.author.id}.cock`);
      let cfupgrade = db.get(`${message.guild.id}.${message.author.id}.cfupgrade`);
      if(!bank) bank = 0;
      if(!pockets) pockets = 0;
      if(!cock) cock = false;
      if(!cfupgrade) cfupgrade = 0;

      var rankonlb;
      if(mesarr[0].name === message.author.id) rankonlb = "1st";
      else if(mesarr[1].name === message.author.id) rankonlb = "2nd";
      else if(mesarr[2].name === message.author.id) rankonlb = "3rd";
      else if(mesarr[3].name === message.author.id) rankonlb = "4th";
      else if(mesarr[4].name === message.author.id) rankonlb = "5th";
      else if(mesarr[5].name === message.author.id) rankonlb = "6th";
      else if(mesarr[6].name === message.author.id) rankonlb = "7th";
      else if(mesarr[7].name === message.author.id) rankonlb = "8th";
      else if(mesarr[8].name === message.author.id) rankonlb = "9th";
      else if(mesarr[9].name === message.author.id) rankonlb = "10th";
      else if(mesarr[10].name === message.author.id) rankonlb = "11th";
      else if(mesarr[11].name === message.author.id) rankonlb = "12th";
      else if(mesarr[12].name === message.author.id) rankonlb = "13th";
      else if(mesarr[13].name === message.author.id) rankonlb = "14th";
      else if(mesarr[14].name === message.author.id) rankonlb = "15th";
      else if(mesarr[15].name === message.author.id) rankonlb = "16th";
      else if(mesarr[16].name === message.author.id) rankonlb = "17th";
      else if(mesarr[17].name === message.author.id) rankonlb = "18th";
      else if(mesarr[18].name === message.author.id) rankonlb = "19th";
      else if(mesarr[19].name === message.author.id) rankonlb = "20th";
      else rankonlb = "20+";

      let hascock;
      if(cock === false) hascock = `:x: \`No\``;
      if(cock === true) hascock = `:white_check_mark: \`Yes\``;
      let cfupgradenr;
      if(cfupgrade === 0) cfupgradenr = "0️⃣";
      if(cfupgrade === 1) cfupgradenr = "1️⃣";
      if(cfupgrade === 2) cfupgradenr = "2️⃣";
      if(cfupgrade === 3) cfupgradenr = "3️⃣";

      const balEmbed = new Discord.MessageEmbed()
      .setTitle("💰 Bal")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`**${message.author}:**
      \n**• 👝 Pockets:** \`${pockets}\` coins
      \n**• 💳 Bank:** \`${bank}\` coins
      \n**• 🐓 Cock:** ${hascock}
      \n**• 🐓 Cock Fight Upgrade:** \`${cfupgradenr}/3️⃣\`
      \n**• 🆙 Rank:** \`${rankonlb}\` on the 💳 Bank leaderboard
      `)
      .setColor(0x96ddff);
      return message.channel.send(balEmbed);
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`> :x: Please mention a valid member of this server!`);
    else {

      let bank = db.get(`${message.guild.id}.${member.id}.bank`);
      let pockets = db.get(`${message.guild.id}.${member.id}.pockets`);
      let cock = db.get(`${message.guild.id}.${member.id}.cock`);
      let cfupgrade = db.get(`${message.guild.id}.${member.id}.cfupgrade`);
      if(!bank) bank = 0;
      if(!pockets) pockets = 0;
      if(!cock) cock = false;
      if(!cfupgrade) cfupgrade = 0;

      var rankonlb;
      if(mesarr[0].name === member.id) rankonlb = "1st";
      else if(mesarr[1].name === member.id) rankonlb = "2nd";
      else if(mesarr[2].name === member.id) rankonlb = "3rd";
      else if(mesarr[3].name === member.id) rankonlb = "4th";
      else if(mesarr[4].name === member.id) rankonlb = "5th";
      else if(mesarr[5].name === member.id) rankonlb = "6th";
      else if(mesarr[6].name === member.id) rankonlb = "7th";
      else if(mesarr[7].name === member.id) rankonlb = "8th";
      else if(mesarr[8].name === member.id) rankonlb = "9th";
      else if(mesarr[9].name === member.id) rankonlb = "10th";
      else if(mesarr[10].name === member.id) rankonlb = "11th";
      else if(mesarr[11].name === member.id) rankonlb = "12th";
      else if(mesarr[12].name === member.id) rankonlb = "13th";
      else if(mesarr[13].name === member.id) rankonlb = "14th";
      else if(mesarr[14].name === member.id) rankonlb = "15th";
      else if(mesarr[15].name === member.id) rankonlb = "16th";
      else if(mesarr[16].name === member.id) rankonlb = "17th";
      else if(mesarr[17].name === member.id) rankonlb = "18th";
      else if(mesarr[18].name === member.id) rankonlb = "19th";
      else if(mesarr[19].name === member.id) rankonlb = "20th";
      else rankonlb = "20+";
      
      let hascock;
      if(cock === false) hascock = `:x: \`No\``;
      if(cock === true) hascock = `:white_check_mark: \`Yes\``;
      let cfupgradenr;
      if(cfupgrade === 0) cfupgradenr = "0️⃣";
      if(cfupgrade === 1) cfupgradenr = "1️⃣";
      if(cfupgrade === 2) cfupgradenr = "2️⃣";
      if(cfupgrade === 3) cfupgradenr = "3️⃣";

      const memberBal = new Discord.MessageEmbed()
      .setTitle("💰 Bal")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(`**${member}:**
      \n**• 👝 Pockets:** \`${pockets}\` coins
      \n**• 💳 Bank:** \`${bank}\` coins
      \n**• 🐓 Cock:** ${hascock}
      \n**• 🐓 Cock Fight Upgrade:** \`${cfupgradenr}/3️⃣\`
      \n**• 🆙 Rank:** \`${rankonlb}\` on the 💳 Bank leaderboard
      `)
      .setColor(0x96ddff);
      return message.channel.send(memberBal);
    }
  }

  module.exports.help = {
    name: "bal",
    aliases: [],
    category: "money"
}