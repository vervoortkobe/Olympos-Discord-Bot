const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const fetch = require("node-fetch");

module.exports.run = async (client, message, args) => {

    let {data} = await fetch;

    fetch("https://reddit.com/r/memes/random/.json")
    .then(res => res.json()).then(data => {
      if(!data[0].data.children[0].data) {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`:x: **|** ***Error: Something went wrong! Please try again!***`)
        return message.channel.send(errorEmbed);
      }

      const memeEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setDescription(`😂 Meme`)
      .setDescription(`**[${data[0].data.children[0].data.title}](https://reddit.com${data[0].data.children[0].data.permalink})**`)
      .setImage(data[0].data.children[0].data.url)
      .setFooter(`👍 ${data[0].data.children[0].data.ups} | 💬 ${data[0].data.children[0].data.num_comments} | r/memes`)
      message.channel.send(memeEmbed);
    });
  }

  module.exports.help = {
    name: "meme",
    aliases: [],
    category: "fun"
}