const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");
const fetch = require("node-fetch");

module.exports.run = async (client, message, args) => {
    
    let {data} = await fetch;

    fetch("https://reddit.com/r/jokes/random/.json")
    .then(res => res.json()).then(data => {
      if(!data[0].data.children[0].data) {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`:x: **|** ***Error: Something went wrong! Please try again!***`)
        return message.channel.send(errorEmbed);
      }

      const jokeEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setDescription(`😂 Joke`)
      .setDescription(`**[${data[0].data.children[0].data.title}](${data[0].data.children[0].data.url})**\n*${data[0].data.children[0].data.selftext}*`)
      .setFooter(`👍 ${data[0].data.children[0].data.ups} | 💬 ${data[0].data.children[0].data.num_comments} | r/jokes`)
      message.channel.send(jokeEmbed);
    });
  }

module.exports.help = {
  name: "joke",
  aliases: [],
  category: "fun"
}