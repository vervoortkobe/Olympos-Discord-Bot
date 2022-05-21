const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let bank = db.get(`${message.guild.id}.${message.author.id}.bank`);
    let pockets = db.get(`${message.guild.id}.${message.author.id}.pockets`);
    let cock = db.get(`${message.guild.id}.${message.author.id}.cock`);
    let cfupgrade = db.get(`${message.guild.id}.${message.author.id}.cfupgrade`);
    if(!bank) bank = 0;
    if(!pockets) pockets = 0;
    if(!cock) cock = false;
    if(!cfupgrade) cfupgrade = 0;

    if(message.guild.id === "565971704782913538") {
      const gambler = message.guild.roles.cache.find(r => r.id === "805459971881304125");
      if(!gambler) console.log("no gambler role!");
      const dicer = message.guild.roles.cache.find(r => r.id === "805460325007753227");
      if(!dicer) console.log("no dicer role!");
      const carddealer = message.guild.roles.cache.find(r => r.id === "805460588687917097");
      if(!carddealer) console.log("no carddealer role!");
      const shuffler = message.guild.roles.cache.find(r => r.id === "805460683692310558");
      if(!shuffler) console.log("no shuffler role!");
      const megaslut = message.guild.roles.cache.find(r => r.id === "806170107873067008");
      if(!megaslut) console.log("no megaslut role!");
      const risktaker = message.guild.roles.cache.find(r => r.id === "805460845248118834");
      if(!risktaker) console.log("no risktaker role!");
      const highroller = message.guild.roles.cache.find(r => r.id === "805460715149721680");
      if(!highroller) console.log("no highroller role!");
      const pokermaster = message.guild.roles.cache.find(r => r.id === "805460746989338646");
      if(!pokermaster) console.log("no pokermaster role!");
      const millionaire = message.guild.roles.cache.find(r => r.id === "809061827597565989");
      if(!millionaire) console.log("no millionaire role!");

      if(bank <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

      if(!args[0] || !args[0].toLowerCase() === "gambler" && !args[0].toLowerCase() === "dicer" && !args[0].toLowerCase() === "carddealer" && !args[0].toLowerCase() === "shuffler" && !args[0].toLowerCase() === "megaslut" && !args[0].toLowerCase() === "risktaker" && !args[0].toLowerCase() === "highroller" && !args[0].toLowerCase() === "pokermaster") return message.channel.send(`> :x: Usage: ***${prefix}claimrank <Gambler/Dicer/Carddealer/Shuffler/Megaslut/Risktaker/Highroller/Pokermaster/Millionaire>***`);

      if(args[0].toLowerCase() === "gambler") {
        if(bank < 25000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Gambler\` rank! You need at least \`25k\` coins!`);

        if(message.member.roles.cache.has(gambler)) return message.channel.send(`> :x: You already claimed the \`Gambler\` rank!`);
        
        message.member.roles.add(gambler);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${gambler}** rank!
        `)
        .setFooter(`Gambler rank costs 25k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "dicer") {
        if(bank < 50000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Dicer\` rank! You need at least \`50k\` coins!`);

        if(message.member.roles.cache.has(dicer)) return message.channel.send(`> :x: You already claimed the \`Dicer\` rank!`);
        
        message.member.roles.add(dicer);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${dicer}** rank!
        `)
        .setFooter(`Dicer rank costs 50k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "carddealer") {
        if(bank < 75000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Card Dealer\` rank! You need at least \`75k\` coins!`);

        if(message.member.roles.cache.has(carddealer)) return message.channel.send(`> :x: You already claimed the \`Card Dealer\` rank!`);
        
        message.member.roles.add(carddealer);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${carddealer}** rank!
        `)
        .setFooter(`Card Dealer rank costs 75k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "shuffler") {
        if(bank < 100000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Shuffler\` rank! You need at least \`100k\` coins!`);

        if(message.member.roles.cache.has(shuffler)) return message.channel.send(`> :x: You already claimed the \`Shuffler\` rank!`);
        
        message.member.roles.add(shuffler);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${shuffler}** rank!
        `)
        .setFooter(`Shuffler rank costs 100k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "megaslut") {
        if(bank < 125000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Supernutty Megaslut\` rank! You need at least \`125k\` coins!`);

        if(message.member.roles.cache.has(megaslut)) return message.channel.send(`> :x: You already claimed the \`Supernutty Megaslut\` rank!`);
        
        message.member.roles.add(megaslut);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${megaslut}** rank!
        `)
        .setFooter(`Supernutty Megaslut rank costs 125k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "risktaker") {
        if(bank < 150000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Risktaker\` rank! You need at least \`150k\` coins!`);

        if(message.member.roles.cache.has(risktaker)) return message.channel.send(`> :x: You already claimed the \`Risktaker\` rank!`);
        
        message.member.roles.add(risktaker);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${risktaker}** rank!
        `)
        .setFooter(`Risktaker rank costs 150k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "highroller") {
        if(bank < 175000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Highroller\` rank! You need at least \`175k\` coins!`);

        if(message.member.roles.cache.has(highroller)) return message.channel.send(`> :x: You already claimed the \`Highroller\` rank!`);
        
        message.member.roles.add(highroller);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${highroller}** rank!
        `)
        .setFooter(`Highroller rank costs 75k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "pokermaster") {
        if(bank < 200000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Poker Master\` rank! You need at least \`200k\` coins!`);

        if(message.member.roles.cache.has(pokermaster)) return message.channel.send(`> :x: You already claimed the \`Poker Master\` rank!`);
        
        message.member.roles.add(pokermaster);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${pokermaster}** rank!
        `)
        .setFooter(`Poker Master rank costs 200k coins`)
        message.channel.send(rankupEmbed);
      }

      if(args[0].toLowerCase() === "millionaire") {
        if(bank < 1000000) return message.channel.send(`> :x: You don't have enough coins in your bank to buy the \`Millionaire\` rank! You need at least \`1m\` coins!`);

        if(message.member.roles.cache.has(millionaire)) return message.channel.send(`> :x: You already claimed the \`Millionaire\` rank!`);
        
        message.member.roles.add(millionaire);

        const rankupEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(0x00ff00)
        .setTitle(`🆙 Rank Up`)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${message.author}!
        \n✅ You successfully claimed your **${millionaire}** rank!
        `)
        .setFooter(`Millionaire rank costs 1m coins`)
        message.channel.send(rankupEmbed);
      }
    }
  }

  module.exports.help = {
    name: "claimrank",
    aliases: ["cr"],
    category: "money"
}