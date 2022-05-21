const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const cooldown = new Set();
const ctime = 300000;

module.exports.run = async (client, message, args) => {

    let bank = db.get(`${message.guild.id}.${message.author.id}.bank`);
    let pockets = db.get(`${message.guild.id}.${message.author.id}.pockets`);
    let cock = db.get(`${message.guild.id}.${message.author.id}.cock`);
    let cfupgrade = db.get(`${message.guild.id}.${message.author.id}.cfupgrade`);
    if(!bank) bank = 0;
    if(!pockets) pockets = 0;
    if(!cock) cock = false;
    if(!cfupgrade) cfupgrade = 0;

    if(!args[0] || !args[0] === "when" && !args[0] === "bet" && !args[0] === "bets" || args[0] === "bet" && !args[1] || args[0] === "bet" && !args[1] === "red" || args[0] === "bet" && !args[1] === "blue" || args[0] === "bet" && !args[1] === "green" || args[0] === "bet" && !args[1] === "black" || args[0] === "bet" && !args[1] === "white" || args[0] === "bet" && !args[1] === "yellow" || args[0] === "bet" && !args[1] === "orange" || args[0] === "bet" && !args[1] === "purple") return message.channel.send(`> :x: Usage: ***${prefix}horserace <bet/when/bets> <red/blue/green/black/white/yellow/orange/purple>***`);

    if(args[0] === "when") {
      const horserace = require("../horserace.json");

      if(horserace["565981819594604544"].countdown) {
        var t1 = new Date(horserace["565981819594604544"].countdown);
        var t2 = t1.setSeconds(t1.getSeconds() + 600);
        var dif = new Date(t2).getTime() - Date.now();

        var Seconds_from_T1_to_T2 = dif / 1000;
        var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

        const when = new Discord.MessageEmbed()
        .setTitle("🏇 Horserace When")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`:x: You still have to wait \`${Seconds_Between_Dates}\` seconds until a new horserace starts!
        `)
        .setColor(0xff0000)
        .setFooter(`A horserace starts every 10 min`)
        return message.channel.send(when);
      }
      if(!horserace["565981819594604544"].countdown) {
        const when = new Discord.MessageEmbed()
        .setTitle("🏇 Horserace When")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`:x: There's already a horserace ongoing!
        \n• Do you want to bet some money on that horse, are you sure it's going to win?
        \n• Bet on a horse, using the command \`${prefix}horserace bet <horse color>\`!
        \n• A bet cost \`1000\` coins!
        \n• If your horse wins, you will receive \`50000\` coins!
        \n• Chance of winning: \`1/8\`
        `)
        .setColor(0xff0000)
        .setFooter(`A horserace starts every 10 min`)
        return message.channel.send(when);
      }
    }

    if(args[0] === "bets") {
      const hrbets = require("../horserace.json");

      let bets = "";
      hrbets["565981819594604544"].participants.forEach(p => {
        bets = bets.concat(`\n• <@${p.name}>: \`${p.horse}\``);
      });

      const betsEmbed = new Discord.MessageEmbed()
      .setTitle("🏇 Horserace Bets")
      .setThumbnail(message.guild.iconURL())
      .setDescription(bets)
      .setColor(0x96ddff)
      .setFooter(`A horserace starts every 10 min`)
      return message.channel.send(betsEmbed);
    }

    if(args[0] === "bet" && args[1] === "red" || args[0] === "bet" && args[1] === "blue" || args[0] === "bet" && args[1] === "green" || args[0] === "bet" && args[1] === "black" || args[0] === "bet" && args[1] === "white" || args[0] === "bet" && args[1] === "yellow" || args[0] === "bet" && args[1] === "orange" || args[0] === "bet" && args[1] === "purple") {

      if(pockets <= 0) return message.channel.send(`> :x: You don't have any coins in your pockets!`);

      if(pockets < 1000) return message.channel.send(`> :x: You don't have enough coins in your pockets! You need \`1000\` coins to bet on a horse in the horserace!`);

      const bets = require("../horserace.json");
      if(!bets["565981819594604544"]) {
        bets["565981819594604544"] = {
          "status": "start",
          "countdown": 0,
          "participants": []
        }
      }

      if(bets["565981819594604544"].status === "stop") return message.channel.send(`> :x: The horserace hasn't started yet! Please wait until it starts (every 10 min)!`);

      bets["565981819594604544"].participants.forEach(p => {
        if(p.name === message.author.id) return message.channel.send(`> :x: You can't bet twice!`);
      });
      
      if(cooldown.has(message.author.id)) return message.channel.send(`> :x: You can't bet twice!`);

      cooldown.add(message.author.id);

      db.add(`${message.guild.id}.${message.author.id}.pockets`, -1000);
      
      let horsename;
      if(args[1] === "red") horsename = "Flash";
      if(args[1] === "blue") horsename = "Thunder";
      if(args[1] === "green") horsename = "Demon";
      if(args[1] === "black") horsename = "Black Hole";
      if(args[1] === "white") horsename = "Ghost";
      if(args[1] === "yellow") horsename = "Sun";
      if(args[1] === "orange") horsename = "Lemon";
      if(args[1] === "purple") horsename = "Blitz";

      const bet = new Discord.MessageEmbed()
      .setTitle("🏇 Horserace Bet")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`✅ You successfully bet on 🐴 ***${horsename} (\`${args[1]}\`)***!
      \n• A bet costs \`1000\` coins!
      \n• If your horse wins, you will receive \`50000\` coins!
      `)
      .setColor(0x00ff00)
      .setFooter(`Chance of winning: 1/8`)
      message.channel.send(bet);

      bets["565981819594604544"].participants.push({"horse": args[1], "name": message.author.id});

      fs.writeFile("./horserace.json", JSON.stringify(bets), err => {
        if(err) console.log(err);
      });
    }

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, ctime);
  }

  module.exports.help = {
    name: "horserace",
    aliases: ["hr"],
    category: "money"
}