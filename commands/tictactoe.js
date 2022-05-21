const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
const { tictactoe } = require("reconlx");
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`> Usage: ***${prefix}tictactoe <@member/member ID>`);

    new tictactoe({
      player_two: member,
      message: message
    });
  }

  module.exports.help = {
    name: "tictactoe",
    aliases: ["ttt", "oxo"],
    category: "fun"
}