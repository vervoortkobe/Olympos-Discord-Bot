const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
//const coins = require("../coins.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    if(message.author.id === "408289224761016332") {
        
      let cmd = args.join(" ");
      if(!cmd) {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xf04947)
        .setDescription(`:x: **|** ***Error: Please define a code to evaluate!***`)
        return message.channel.send(errorEmbed);
      }
        
      if(cmd.toLowerCase().includes("token") || cmd.toLowerCase().includes("config") || cmd.toLowerCase().includes("process.env")) {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xf04947)
        .setDescription(`:x: **|** ***Error: That is forbidden!***`)
        return message.channel.send(errorEmbed);
      }

      const clean = text => {
        if(typeof text === "string")
          return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
          else return text;
      }

      try {
        const code = args.slice(0).join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

        message.channel.send(clean(evaled), { code: "xl" });
      } catch(err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }
  }

module.exports.help = {
  name: "eval",
  aliases: ["evaluate"],
  category: "owner"
}