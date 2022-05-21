const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(!args[0]) return message.channel.send(`> Usage: ***${prefix}say <message>***`);
    message.delete();
    message.channel.send(args.join(" "));
  }

  module.exports.help = {
    name: "say",
    aliases: [],
    category: "other"
}