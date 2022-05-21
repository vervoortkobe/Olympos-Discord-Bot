const Discord = require("discord.js");
const fs = require("fs");
const prefix = "0";
const fetch = require("node-fetch");

module.exports.run = async (client, message, args) => {

    if(!args[0] || !args[1] || !args[0].includes("#") || !args[1] === "competitive" || !args[1] === "deathmatch" || !args[1] === "escalation" || !args[1] === "spikerush" || !args[1] === "unrated") {
      const errorEmbed = new Discord.MessageEmbed()
      .setColor(0xff4654)
      .setTitle(`<:valorant:797173598020173844> Valorant Stats`)
      .setDescription(`> :x: Usage: ***${prefix}valstats <\`Username#Tag\`> <competitive/deathmatch/escalation/spikerush/unrated>***\n> Example: ***0valstats Tsunami#6271 spikerush***`)
      return message.channel.send(errorEmbed);
    }

    let gamemode;
    if(args[1] === "competitive") gamemode = "Competitive";
    if(args[1] === "deathmatch") gamemode = "DeathMatch";
    if(args[1] === "escalation") gamemode = "Escalation";
    if(args[1] === "spikerush") gamemode = "Spike Rush";
    if(args[1] === "unrated") gamemode = "Unrated";

    fetch(`https://tracker.gg/valorant/profile/riot/${args[0].split("#")[0]}%23${args[0].split("#")[1]}/overview?playlist=${args[1]}`)
    .then(res => res.text())
    .then(body => {

      try {
        const av = body.split('<image height="100%" width="100%" preserveAspectRatio="xMinYMin slice" href="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/')[1].slice(0, 121);
        const avatar = decodeURIComponent(av);
        const kadratio = body.split('<span class="valorant-highlighted-stat__value" data-v-b632d9da data-v-11263818>')[1].slice(0, 4);
        const kdratio = body.split('<span title="K/D Ratio" class="name" data-v-5edf1b22>K/D Ratio</span> <!----> <span class="value" data-v-5edf1b22>')[1].slice(0, 4);
        const winpercentage = body.split('<span title="Win %" class="name" data-v-5edf1b22>Win %</span> <!----> <span class="value" data-v-5edf1b22>')[1].slice(0, 4).replace("<", "").replace("/", "").replace("s", "").replace("p", "").replace("%", "");
        const wins = body.split('<span title="Wins" class="name" data-v-5edf1b22>Wins</span> <!----> <span class="value" data-v-5edf1b22>')[1].slice(0, 3).replace("<", "").replace("/", "").replace("s", "").replace("p", "");
        const kills = body.split('<span title="Kills" class="name" data-v-5edf1b22>Kills</span> <!----> <span class="value" data-v-5edf1b22>')[1].slice(0, 6).replace("<", "").replace("/", "").replace("s", "").replace("p", "");
        const deaths = body.split('<span title="Deaths" class="name" data-v-5edf1b22>Deaths</span> <!----> <span class="value" data-v-5edf1b22>')[1].slice(0, 6).replace("<", "").replace("/", "").replace("s", "").replace("p", "");
        const assists = body.split('<span title="Assists" class="name" data-v-5edf1b22>Assists</span> <!----> <span class="value" data-v-5edf1b22>')[1].slice(0, 4).replace("<", "").replace("/", "").replace("s", "").replace("p", "");

        const valstatsEmbed = new Discord.MessageEmbed()
        .setColor(0xff4654)
        .setTitle(`<:valorant:797173598020173844> Valorant Stats`)
        .setThumbnail(avatar)
        .setDescription(`**Username#Tag » **\`${decodeURIComponent(args[0])}\`\n**Gamemode » **\`${gamemode}\`
        \n**KAD Ratio » **\`${kadratio}\`\n**K/D Ratio » **\`${kdratio}\`\n**Win % » **\`${winpercentage}%\`
        \n**Wins » **\`${wins}\`
        \n**Kills » **\`${kills}\`\n**Deaths » **\`${deaths}\`\n**Assists » **\`${assists}\`
        \n[\`View Profile » ${args[0]}\`](https://tracker.gg/valorant/profile/riot/${args[0].split("#")[0]}%23${args[0].split("#")[1]}/overview?playlist=${args[1]})
        `)
        message.channel.send(valstatsEmbed);
      } catch(err) {
        const errorEmbed = new Discord.MessageEmbed()
        .setColor(0xff4654)
        .setTitle(`<:valorant:797173598020173844> Valorant Stats`)
        .setDescription(`
        > :x: Error! Something went wrong!
        \n> Is the given \`Username#Tag\` (\`${decodeURIComponent(args[0])}\`) correct?\n> Is this profile **private**?
        \n[\`View Profile » ${decodeURIComponent(args[0])}\`](https://tracker.gg/valorant/profile/riot/${args[0].split("#")[0]}%23${args[0].split("#")[1]}/overview?playlist=${args[1]})
        `)
        return message.channel.send(errorEmbed);
      }
    });
  }

  module.exports.help = {
    name: "valstats",
    aliases: [],
    category: "other"
}