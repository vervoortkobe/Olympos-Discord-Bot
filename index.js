const express = require("express");
var Client = require("uptime-robot");

const app = express();

app.get("/", (req, res) => {
  res.send("online");
});

//app.get("/pokemon/", (req, res) => {

//  const pokemon = require("./pokemon.json");

//  var t1 = new Date(pokemon["565981819594604544"].countdown);
//  var t2 = t1.setSeconds(t1.getSeconds() + 300);
//  var dif = new Date(t2).getTime() - Date.now();

//  var Seconds_from_T1_to_T2 = dif / 1000;
//  var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2).toFixed(2);

//  res.send(`<b>Pokémon:</b><br>
//  ${pokemon["565981819594604544"].pokemon}<br><br>
//  <b>Guessed?:</b><br>
//  ${pokemon["565981819594604544"].guessed}<br><br>
//  <b>Countdown:</b><br>
//  ${Seconds_Between_Dates} seconds before a Pokémon spawns<br><br>
//  <b>A Pokémon spawns every 5 min</b>
//  `);

//});

app.use(express.static("public"));

const listener = app.listen(process.env.PORT, function() {
  console.log("✔️  Your app is listening on port: " + listener.address().port);
});

///////////////////////////////////////////////////////////////////////////////////

const Discord = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const client = new Discord.Client({ disableMentions: "everyone", ws: { intents: new Discord.Intents(Discord.Intents.ALL) }, partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"] });
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const prefix = "0";
//const { tictactoe } = require("reconlx");
//const coins = require("./coins.json");
//const countdowns = require("./countdowns.json");
const fetch = require("node-fetch");
//const ffmpeg = require("ffmpeg-static");
//const opus = require("opusscript");
//const ytdl = require("ytdl-core");
//const { YouTube } = require("popyt");
//const ytpl = require("ytpl");
const db = require("quick.db");
//const moment = require("moment");
//const fetch = require("node-fetch");

fs.readdir("./commands/", (err, files) => {
 
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌  I couldn't find the commands map!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {

    let props = require(`./commands/${f}`);
    console.log(`${f} was loaded!`);
    client.commands.set(props.help.name, props);

    props.help.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
    
  });

});

  client.on("ready", async () => {
    fs.readdir("./commands/", (err, files) => {
      let jsfile = files.filter(f => f.split(".").pop() === "js");

      console.log("\x1b[0m", "");
      console.log("\x1b[36m", `» All ${jsfile.length} commands were loaded!`);
      console.log("\x1b[32m", `✔️  ${client.user.username} was started!`);
      console.log("\x1b[0m", "");

    });

    //client.user.setPresence({status: "invisible"});
    client.user.setActivity(`${process.env.PREFIX}help | ${client.user.username}`, {type: "PLAYING"});

    //setInterval(() => {
    //  pokespawn();
    //}, 300000);

    //setInterval(() => {
    //  horserace();
    //}, 600000);
  });

////////////////////////////////////////////////////////////////////////////////////////////////////
//INVITE_LOGS
const invites = {};

client.on("ready", async () => {
  setTimeout(() => {

    client.guilds.cache.forEach(g => {
      g.fetchInvites().then(guildInvites => {
        invites[g.id] = guildInvites;
      });
    });
  }, 1000);
});

client.on("guildMemberAdd", member => {

  member.guild.fetchInvites().then(guildInvites => {

    const ei = invites[member.guild.id];

    invites[member.guild.id] = guildInvites;

    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);

    const inviter = client.users.cache.get(invite.inviter.id);

    const logChannel = member.guild.channels.cache.find(c => c.name === "olympos-logs");

    if(logChannel) logChannel.send(`${member} joined using invite code https://discord.gg/${invite.code}, made by ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//MESSAGE_DELETE
  client.on("messageDelete", async delMsg => {

    if(delMsg.guild.id === "565971704782913538") return;

    if(!delMsg.partial) {

      const msglogChannel = delMsg.guild.channels.cache.find(c => c.name === `olympos-msglogs`);
      if(msglogChannel) {
        if(delMsg.content === "") return;

        const fetchedLogs = await delMsg.guild.fetchAuditLogs({
          limit: 1,
          type: "MESSAGE_DELETE",
        });
        
        const deletionLog = fetchedLogs.entries.first();
        
        let deletedby;
        if(!deletionLog) deletedby = "Unknown";

        const { executor, target } = deletionLog;

        if(target) {
          deletedby = executor;
        }	else {
          deletedby = "Unknown Executor";
        }

        if(delMsg.length > 1000) {
          const msgdelLogEmbed = new Discord.MessageEmbed()
          .setColor(0x96ddff)
          .setTitle(`⚙️ | Logs`)
          .setThumbnail(delMsg.author.displayAvatarURL())
          .setDescription(`**• MESSAGE_DELETE:**
          \n**${deletedby} deleted** a message of **${delMsg.author.tag} in ${delMsg.channel}**!
          \n**• Deleted Message:** \`\`\`This message was too long to display!\`\`\`
          `)
          return msglogChannel.send(msgdelLogEmbed);
        }

        let delmsgcontent;
        if(delMsg.content) {
          delmsgcontent = delMsg.content;
        } else {
          delmsgcontent = "Unknown Message";
        }

        const msgdelLogEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`⚙️ | Logs`)
        .setThumbnail(delMsg.author.displayAvatarURL())
        .setDescription(`**• MESSAGE_DELETE:**
        \n**${deletedby} deleted** a message of **${delMsg.author.tag} in ${delMsg.channel}**!
        \n**• Deleted Message:** \`\`\`${delmsgcontent}\`\`\`
        `)
        msglogChannel.send(msgdelLogEmbed);
      }
    }
  });

////////////////////////////////////////////////////////////////////////////////////////////////////
//MESSAGE_UPDATE
  client.on("messageUpdate", async (oldMsg, newMsg) => {

    if(oldMsg.guild.id === "565971704782913538") return;

    if(!oldMsg.partial) {

      if(newMsg.author.id === client.user.id) return;

      const msglogChannel = newMsg.guild.channels.cache.find(c => c.name === `olympos-msglogs`);
      if(msglogChannel) {
        if(oldMsg.content === "" || newMsg.content === "" || oldMsg.content === newMsg.content) return;

        let oldmsg;
        let newmsg;
        if(oldMsg.length > 1000) oldmsg = `This message was too long to display!`;
        else oldmsg = oldMsg.content;
        if(newMsg.length > 1000) newmsg = `This message was too long to display!`;
        else newmsg = newMsg.content;

        msgupdEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`⚙️ | Logs`)
        .setThumbnail(newMsg.author.displayAvatarURL())
        .setDescription(`**• MESSAGE_UPDATE:**
        \nA message from **${newMsg.author} in ${newMsg.channel}** was **edited**!
        \n**• Old Message:** \`\`\`${oldmsg}\`\`\`
        \n**• New Message:** \`\`\`${newmsg}\`\`\`
        `)
        msglogChannel.send(msgupdEmbed);
      }
    }
  });

/////////////////////////////////////////////////////////////////////////////////////////////
//GIVEAWAY
  client.on("messageReactionAdd", async (reaction, user) => {

    if(reaction.message.guild.id === "565971704782913538") return;
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(!user.bot && reaction.message.author.id === client.user.id) {
      if(reaction.emoji.name === "✅") {
      
      const giveaway = require("./giveaway.json");
      if(giveaway.includes("claimed")) return reaction.message.channel.send(`> :x: Someone already claimed this giveaway!`);

        //reaction.message.reactions.resolve("✅").users.remove(user);
        reaction.message.reactions.removeAll();
        
        db.add(`${reaction.message.guild.id}.${user.id}.pockets`, 500);

        const edit = new Discord.MessageEmbed()
        .setColor(0x00ff00)
        .setAuthor(user.tag, user.displayAvatarURL())
        .setTitle(`🎉 Giveaway Claimed`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`🎉 Congratulations, ${user}!
        \n✅ **${user}** claimed the giveaway and received \`500\` coins!
        `)
        .setFooter(`Don't forget to deposit the money in your pockets to your bank`)
        reaction.message.edit(edit)
        .then(m => m.react("🎉"));

        fs.writeFile("./giveaway.json", JSON.stringify(["claimed"]), err => {
          if(err) console.log(err);
        });
      }
    }
  });

////////////////////////////////////////////////////////////////////////////////////////////////////
//HELP COMMAND REACTION

  client.on("messageReactionAdd", async (reaction, user) => {

    if(reaction.message.guild.id === "565971704782913538") return;
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(!user.bot && reaction.message.author.id === client.user.id) {
      
      if(reaction.emoji.name === "🤖") {
        reaction.message.reactions.resolve("🤖").users.remove(user);

        const helpEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`🤖 Help`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`***• My prefix is \`${prefix}\`!***
        \n***• Check the shop with the command \`${prefix}shop\`!***
        `)
        .setDescription(`• \`⛑ Moderation (6)\`
        \n• \`💸 Money (17)\`
        \n• \`😂 Fun (4)\`
        \n• \`📁 Other (2)\`
        \n• \`🎧 Music (10)\`
        \n• \`ℹ️ About (1)\`
        `)
        reaction.message.edit(helpEmbed)
      }
      if(reaction.emoji.name === "⛑") {
        reaction.message.reactions.resolve("⛑").users.remove(user);

        const helpModerationEmbed = new Discord.MessageEmbed()
        .setColor(0x96ddff)
        .setTitle(`🤖 Help`)
        .addField(`⛑ Moderation (7)`, `
        \`\`\`${prefix}delwarns, ${prefix}mute, ${prefix}pardon, ${prefix}purge, ${prefix}unmute, ${prefix}warn, ${prefix}warnings\`\`\`
        `)
        reaction.message.edit(helpModerationEmbed);
      }

      if(reaction.emoji.name === "💸") {
        reaction.message.reactions.resolve("💸").users.remove(user);
        
        const helpMoneyEmbed = new Discord.MessageEmbed()
        .setColor(0x03a9f4)
        .setTitle(`🤖 Help`)
        .addField(`💸 Money (17)`, `
        \`\`\`${prefix}bal, ${prefix}buycock, ${prefix}cfupgrade, ${prefix}claimrank, ${prefix}cockfight, ${prefix}crime, ${prefix}daily, ${prefix}deposit, ${prefix}give, ${prefix}giveaway, ${prefix}horserace, ${prefix}leaderboard, ${prefix}rob, ${prefix}shop, ${prefix}slut, ${prefix}withdraw, ${prefix}work\`\`\`
        `)
        reaction.message.edit(helpMoneyEmbed);
      }

      if(reaction.emoji.name === "😂") {
        reaction.message.reactions.resolve("😂").users.remove(user);
        
        const helpFunEmbed = new Discord.MessageEmbed()
        .setColor(0x03a9f4)
        .setTitle(`🤖 Help`)
        .addField(`😂 Fun (4)`, `
        \`\`\`${prefix}joke, ${prefix}meme, ${prefix}ppsize, ${prefix}tictactoe\`\`\`
        `)
        reaction.message.edit(helpFunEmbed);
      }

      if(reaction.emoji.name === "📁") {
        reaction.message.reactions.resolve("📁").users.remove(user);
        
        const helpOtherEmbed = new Discord.MessageEmbed()
        .setColor(0x03a9f4)
        .setTitle(`🤖 Help`)
        .addField(`📁 Other (2)`, `
        \`\`\`${prefix}say, ${prefix}valstats\`\`\`
        `)
        reaction.message.edit(helpOtherEmbed);
      }

      if(reaction.emoji.name === "🎧") {
        reaction.message.reactions.resolve("🎧").users.remove(user);
        
        const helpMusicEmbed = new Discord.MessageEmbed()
        .setColor(0x03a9f4)
        .setTitle(`🤖 Help`)
        .addField(`🎧 Music (10)`, `
        \`\`\`${prefix}lyrics, ${prefix}nowplaying, ${prefix}pause, ${prefix}play, ${prefix}queue, ${prefix}remove, ${prefix}resume, ${prefix}skip, ${prefix}stop, ${prefix}volume\`\`\`
        `)
        reaction.message.edit(helpMusicEmbed);
      }

      if(reaction.emoji.name === "ℹ️") {
        reaction.message.reactions.resolve("ℹ️").users.remove(user);
        
        const helpAboutEmbed = new Discord.MessageEmbed()
        .setColor(0x03a9f4)
        .setTitle(`🤖 Help`)
        .addField(`ℹ️ About (1)`, `
        \`\`\`${prefix}ping\`\`\`
        `)
        reaction.message.edit(helpAboutEmbed);
      }
    }
  });

/////////////////////////////////////////////////////////////////////////////////////////////
//POKEMON
  async function pokespawn() {
    let spawnchan = client.channels.cache.get("565981819594604544");
    if(!spawnchan) console.log("no spawnchan found!");

    let pokelist = require("./pokelist.json");
    let result = Math.floor((Math.random() * pokelist.length));

    const pokemon = require("./pokemon.json");
    if(!pokemon[spawnchan.id]) {
      pokemon[spawnchan.id] = {
        "pokemon": "pikachu",
        "guessed": true,
        "countdown": 0
      }
    }

    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokelist[result]}`);
    let json = await res.json();

    let pokePic = new Discord.MessageAttachment(json.sprites.front_default, "pokemon.png");

    let hint;
    if(pokelist[result].length === 1) hint = `\`${pokelist[result].charAt(0)}\``;
    if(pokelist[result].length === 2) hint = `\`${pokelist[result].charAt(0)}\` \`.\``;
    if(pokelist[result].length === 3) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\``;
    if(pokelist[result].length === 4) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`.\``;
    if(pokelist[result].lenght === 5) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 6) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\``;
    if(pokelist[result].length === 7) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 8) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 9) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 10) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`${pokelist[result].charAt(7)}\` \`.\` \`.\``;
    if(pokelist[result].length === 11) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`${pokelist[result].charAt(7)}\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 12) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`${pokelist[result].charAt(7)}\` \`.\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 13) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`${pokelist[result].charAt(7)}\` \`.\` \`.\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 14) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`${pokelist[result].charAt(7)}\` \`.\` \`.\` \`.\` \`.\` \`.\` \`.\``;
    if(pokelist[result].length === 15) hint = `\`${pokelist[result].charAt(0)}\` \`.\` \`.\` \`${pokelist[result].charAt(3)}\` \`.\` \`.\` \`.\` \`${pokelist[result].charAt(7)}\` \`.\` \`.\` \`.\` \`.\` \`.\` \`.\` \`.\``;

    const pokespawnEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle("Pokémon Spawned")
    .setDescription(`• Do you know the name of this Pokémon?
    \n• Type its correct name to get \`500\` coins!
    \n• Hint: ${hint}
    `)
    .attachFiles(pokePic)
    .setImage("attachment://pokemon.png")
    .setFooter(`A Pokémon spawns every 5 min`)
    await spawnchan.send(pokespawnEmbed)
    .then(m => {
      pokemon[spawnchan.id] = {
        "pokemon": pokelist[result],
        "guessed": false,
        "countdown": m.createdTimestamp
      }

      fs.writeFile("./pokemon.json", JSON.stringify(pokemon), err => {
        if(err) console.log(err);
      });
    });
  }

/////////////////////////////////////////////////////////////////////////////////////////////
//HORSERACE
  async function horserace() {
    let spawnchan = client.channels.cache.get("565981819594604544");
    if(!spawnchan) console.log("no spawnchan found!");

    const horserace = require("./horserace.json");
    if(!horserace[spawnchan.id]) {
      horserace[spawnchan.id] = {
        "status": "start",
        "countdown": 0,
        "participants": []
      }
    }

    const horseraceEmbed = new Discord.MessageEmbed()
    .setColor(0x96ddff)
    .setTitle("🏇 Horserace will start in 5 min")
    .setDescription(`• Do you want to bet some money on that horse, are you sure it's going to win?
    \n• Bet on a horse, using the command \`${prefix}horserace bet <horse color>\`!
    \n• A bet cost \`1000\` coins!
    \n• If your horse wins, you will receive \`50000\` coins!
    \n• 🐴 Horses: Flash (\`red\`), Thunder (\`blue\`), Demon (\`green\`), Black Hole (\`black\`), Ghost (\`white\`), Sun (\`yellow\`), Lemon (\`orange\`), Blitz (\`purple\`)
    \n• Chance of winning: \`1/8\`
    `)
    .setFooter(`A horserace starts every 10 min`)
    await spawnchan.send(horseraceEmbed)
    .then(m => {
      horserace[spawnchan.id] = {
        "status": "start",
        "participants": []
      }

      fs.writeFile("./horserace.json", JSON.stringify(horserace), err => {
        if(err) console.log(err);
      });
    });

    setTimeout(() => {

      const bets = require("./horserace.json");
      if(!bets[spawnchan.id]) {
        bets[spawnchan.id] = {
          "status": "start",
          "participants": []
        }
      }

      if(!bets[spawnchan.id].participants) {

        horserace[spawnchan.id] = {
          "status": "stop",
          "participants": []
        }

        fs.writeFile("./horserace.json", JSON.stringify(horserace), err => {
          if(err) console.log(err);
        });
        return spawnchan.send(`> :x: Nobody bet money on a horse!`);
      }

      let horses = ["red", "blue", "green", "black", "white", "yellow", "orange", "purple"];
      let result = Math.floor((Math.random() * horses.length));

      let horsename;
      if(horses[result] === "red") horsename = "Flash";
      if(horses[result] === "blue") horsename = "Thunder";
      if(horses[result] === "green") horsename = "Demon";
      if(horses[result] === "black") horsename = "Black Hole";
      if(horses[result] === "white") horsename = "Ghost";
      if(horses[result] === "yellow") horsename = "Sun";
      if(horses[result] === "orange") horsename = "Lemon";
      if(horses[result] === "purple") horsename = "Blitz";

      const endedEmbed = new Discord.MessageEmbed()
      .setColor(0x96ddff)
      .setTitle("🏇 Horserace ended")
      .setDescription(`• ***${horsename} (\`${horses[result]}\`) won*** the race! 🏅
      `)
      .setFooter(`Don't forget to deposit the money in your pockets to your bank`)
      spawnchan.send(endedEmbed).then(m => {

        bets[spawnchan.id].participants.forEach(p => {
          if(p.horse === horses[result]) {
            const wonEmbed = new Discord.MessageEmbed()
            .setColor(0x00ff00)
            .setTitle("🎉 Congratulations!")
            .setDescription(`• You bet on the winning horse (\`${horses[result]}\`) and won \`50000\` coins, **<@${p.name}>**! 🐴
            `)
            .setFooter(`Don't forget to deposit the money in your pockets to your bank`)
            spawnchan.send(wonEmbed);

            db.add(`565971704782913538.${p.name}.pockets`, 50000);

          } else spawnchan.send(`> :x: You bet on the wrong horse and lost your money, <@${p.name}>! :/`);
        });

        horserace[spawnchan.id] = {
          "status": "stop",
          "countdown": m.createdTimestamp,
          "participants": []
        }

        fs.writeFile("./horserace.json", JSON.stringify(horserace), err => {
          if(err) console.log(err);
        });
      });

    }, 300000);
  }

/////////////////////////////////////////////////////////////////////////////////////////////

  client.on("message", async message => {

    //if(message.guild.id === "565971704782913538") return;
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    db.add(`${message.guild.id}.${message.author.id}.pockets`, 1);

/////////////////////////////////////////////////////////////////////////////////////////////
//HANGMAN

    let settings = JSON.parse(fs.readFileSync("./hangman.json", "utf8"));
    if (message.channel.id == settings.channel || (!settings.channel && message.channel.name.includes("hangman"))) {
        if (!settings.word) return nieuwWoord()

        let word = settings.word;
        let vooruitgang = settings.vooruitgang;
        let content = message.content.toLowerCase()
        let active = settings.active
        if(active == false) return message.channel.send("There aren't any words left! A \`Hangman Master\` has to add new words to the word list again!");
        if (message.author.id === settings.lastUser) {
          message.delete();
          return message.channel.send(`:x: | Please wait for someone else to guess a letter!`);
        }
        settings.lastUser = message.author.id;
        fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
            if (err) console.log(err);
        });

        if (message.content.length == 1) {

            let juist = false;
            for(let i = 0; i < word.length; i++) {
                if(word.charAt(i) == content) {
                    juist = true;
                    settings.vooruitgang[i] = content
                    fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
                        if(err) console.log(err);
                    });
                }
            }

            if (juist == true) { // juist
                message.react("✅")
                updateMessage()

            } else { // fout
                message.react("❌")
                settings.guesses += 1
                settings.levens -= 1

                let fout = true;
                for (let i = 0; i < settings.fouteLetters.length; i++) {
                    if (settings.fouteLetters[i] == content) {
                        fout = false
                    }
                }
                if (fout == true) settings.fouteLetters.push(content)


                fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
                    if(err) console.log(err);
                });
                updateMessage()


            }
        } else {

            if (message.content.toLowerCase() == settings.word.toLowerCase()) { // woord geraden!
                message.channel.messages.fetch(settings.msg).then(async msg => {
                    msg.edit(new Discord.MessageEmbed()
                        .setTitle("Hangman")
                        .setDescription(`• **${message.author}** guessed the word!
                        \n• You received \`500\` coins!
                        `)
                        .setColor("2cfc03")
                        .setFooter(`Don't forget to deposit the money in your pockets to your bank`)
                        .setTimestamp()
                        );

                    db.add(`${message.guild.id}.${message.author.id}.pockets`, 500);
                    
                    nieuwWoord();
                });
                message.react("✅")
            } else { // fout
                message.react("❌")
                settings.fouteLetters.push(content)
                fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
                    if (err) console.log(err);
                });
            }

        }

        fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
            if(err) console.log(err);
        });


        async function nieuwWoord() {


            let words = JSON.parse(fs.readFileSync("./words.json", "utf8"));
            if(words.length < 1) {
                message.channel.send(`There aren't any words left! 
                \nA \`Hangman Master\` has to add new words to the word list again!`);
                let galgjeKanaal = message.guild.channels.cache.get(process.env.HANGMANCHANNEL)
                if(galgjeKanaal) galgjeKanaal.send("There aren't any words left! :(")
                else console.log("I couldn't find a hangman channel!")
                settings.active = false
                fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
                    if(err)
                        console.log(err);
                });
                return;
            } else {

                let msg = await message.channel.send(new Discord.MessageEmbed()
                .setTitle("Hangman")
                .setDescription(":mag: | I chose a new word, good luck!")
                .setColor("#96ddff")
                .setTimestamp()
            );

                let random = Math.floor(Math.random() * words.length)
                let word = words[random]
                words.splice(random, 1);
                fs.writeFile("./words.json", JSON.stringify(words), (err) => {
                    if (err)
                        console.log(err);
                });

                let levens = word.length + 1

                settings = {
                    active: true,
                    channel: message.channel.id,
                    word: word,
                    lastUser: "",
                    guesses: 0,
                    levens: levens,
                    msg: msg.id,
                    vooruitgang: [],
                    fouteLetters: []
                };

                for(let x = 0; x < word.length; x++) {
                    settings.vooruitgang.push("_")
                }
                fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
                    if(err)
                      console.log(err);
                });

            }
        }

        async function updateMessage() {
            message.channel.messages.fetch(settings.msg).then(async msg => {

                let levens = settings.levens;
                let juist = true
                for (let i = 0; i < word.length; i++) {
                    if (word.charAt(i) !== vooruitgang[i]) juist = false;
                }
                let geradenLetters = "`";
                for (let i = 0; i < vooruitgang.length; i++) {
                    geradenLetters += vooruitgang[i] + " ";
                }
                geradenLetters += "`"

                let fouteLettersBericht = "`";
                for (let i = 0; i < settings.fouteLetters.length; i++) {
                    fouteLettersBericht += settings.fouteLetters[i] + ", ";
                }
                fouteLettersBericht += " `"

                if (levens < 1) {
                    msg.edit(new Discord.MessageEmbed()
                        .setTitle("Hangman - You didn't guess the word in time, I win!")
                        .setColor("#ff0000")
                        .setDescription(`**Progress:** ${geradenLetters}
                        \n**Wrong letters:** ${fouteLettersBericht}
                        \n**Lifes left:** \`${levens}\``)
                        .setTimestamp()

                    );
                    nieuwWoord();
                } else if (juist == true) {
                    await msg.edit(new Discord.MessageEmbed()
                        .setTitle("Hangman - You guessed the word, you win!")
                        .setColor("#00ff00")
                        .setDescription(`**Progress:** ${geradenLetters}
                        \n**Wrong letters:** ${fouteLettersBericht}
                        \n**Lifes left:** \`${levens}\`
                        \n• **${message.author} guessed the word!**
                        \n• You received \`500\` coins!
                        `)
                        .setTimestamp()
                        );

                    db.add(`${message.guild.id}.${message.author.id}.pockets`, 500);

                    nieuwWoord();
                } else {
                    msg.edit(new Discord.MessageEmbed()
                        .setTitle("Hangman")
                        .setDescription(`**Progress:** ${geradenLetters}
                        \n**Wrong letters:** ${fouteLettersBericht}
                        \n**Lifes left:** \`${levens}\``)
                        .setColor("#96ddff")
                        .setTimestamp()
                    );
                }
            });
        }

    } else if (message.channel.id == process.env.HANGMANCHANNEL) {
        if (message.content.startsWith("!addword")) {

            if (!message.member.roles.cache.has(process.env.HANGMANROLE)) return message.channel.send("You aren't allowed to do this!");
            let words = JSON.parse(fs.readFileSync("./words.json", "utf8"));
            let args = message.content.split(" ").slice(1)
            if (!args[0]) return message.channel.send(`:x: **|** \`Usage:\` ***${prefix}addword <word>***`)
            words.push(args[0].toLowerCase())
            fs.writeFile("./words.json", JSON.stringify(words), (err) => {
                if (err) console.log(err), message.channel.send("> :x: Something went wrong!")
                else message.channel.send(`The word \`${args[0].toLowerCase()}\` was added to the hangman word list!`)
            });
            let settings = JSON.parse(fs.readFileSync("./hangman.json", "utf8"));
            if(settings.active == false) {
                
            settings.active = true
            await fs.writeFile("./hangman.json", JSON.stringify(settings), (err) => {
                if (err)
                    console.log(err);
            });
        }
        } else if (message.content.startsWith("!delword")) {

            if (!message.member.roles.cache.has(process.env.HANGMANROLE)) return message.channel.send("You aren't allowed to do this!");
            let words = JSON.parse(fs.readFileSync("./words.json", "utf8"));
            let args = message.content.split(" ").slice(1)
            if (!args[0]) return message.channel.send(`:x: **|** \`Usage:\` ***${prefix}delword <word>***`)
            
            function arrayRemove(arr, value) { 
              return arr.filter(function(ele) {
                return ele != value;
              });
            }
            var result = arrayRemove(words, args[0].toLowerCase());

            fs.writeFile("./words.json", JSON.stringify(result), (err) => {
                if (err) console.log(err), message.channel.send("> :x: Something went wrong!")
                else message.channel.send(`The word \`${args[0].toLowerCase()}\` was removed from the hangman word list!`)
            });

        } else if (message.content === "!wordsjson") {
          message.channel.send("> This file contains all words in the words.json file!");
          message.channel.send({ files: ["./words.json"] });

        } else if (message.content === "!wordlist" || message.content === "!words") {
            let words = JSON.parse(fs.readFileSync("./words.json", "utf8"));
            let tekst = `__**Words (${words.length}):**__`;
            let wordlist = words.sort();
            wordlist.forEach(e => {
                tekst += `\n• \`${e}\``;
            });
            message.channel.send(new Discord.MessageEmbed().setTitle("Hangman Word List").setDescription(tekst).setColor("#96ddff"));

        } else if (message.content === "!currentword" || message.content === "!wordrn") {
          let hangmandata = require("./hangman.json");
          const wordrn = new Discord.MessageEmbed()
          .setColor(0x96ddff)
          .setTitle("Current Hangman Word")
          .setDescription(`\`${hangmandata.word}\``)
          message.channel.send(wordrn);
        }
    }

/////////////////////////////////////////////////////////////////////////////////////////////
//UPVOTE DOWNVOTE
  let upvote = client.emojis.cache.get("566381946268024842");
  let downvote = client.emojis.cache.get("566381869902331922");

  if(message.channel.id === "805421060974575616") {
    message.react(`${upvote}`);
    message.react(`${downvote}`);
  }

/////////////////////////////////////////////////////////////////////////////////////////////
//POKEMON GUESS

  if(message.channel.id === "565981819594604544") {
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    const pokemon = require("./pokemon.json");
    if(!pokemon["565981819594604544"]) {
      pokemon["565981819594604544"] = {
        "pokemon": "pikachu",
        "guessed": false
      }
    }
    if(!args[0] && !message.content.startsWith("0") && pokemon["565981819594604544"].guessed === false) {
      if(message.content.toLowerCase() === pokemon["565981819594604544"].pokemon) {
        message.react("✅");

        if(pokemon["565981819594604544"].guessed === false) {
          pokemon["565981819594604544"].guessed =
          true;

          fs.writeFile("./pokemon.json", JSON.stringify(pokemon), err => {
            if(err) console.log(err);
          });


          db.add(`${message.guild.id}.${message.author.id}.pockets`, 500);
          
          let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon["565981819594604544"].pokemon}`);
          let json = await res.json();

          let pokePic = new Discord.MessageAttachment(json.sprites.front_default, "pokemon.png");


          const correct = new Discord.MessageEmbed()
          .setColor(0x00ff00)
          .setTitle(`Pokémon Guessed`)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(`✅ **${message.author}** guessed the Pokémon's name correctly and received \`500\` coins!
          \n• This Pokémon is a \`${pokemon["565981819594604544"].pokemon}\`!
          `)
          .setThumbnail("attachment://pokemon.png")
          .attachFiles(pokePic)
          .setFooter(`A Pokémon spawns every 5 min\nDon't forget to deposit the money in your pockets to your bank`)
          message.channel.send(correct);
        } else {
          return message.channel.send(`> :x: Someone already guessed this Pokémon's name!`);
        }
      } else {
        message.react("❌");
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////
//MUSICPLAYER
  const MusicClient = require("./musicplayer/index.js");
  const musicplayer = new MusicClient({
    botPrefix: prefix,
    ytApiKey: process.env.YTAPIKEY,
    botClient: client
  });

  if(message.content.startsWith(musicplayer.prefix)) {
    musicplayer.onMessage(message);
  }

/////////////////////////////////////////////////////////////////////////////////////////////

  //let prefix = config.prefix;
  if(!message.content.startsWith(prefix)) return;
  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
  if(commandfile) commandfile.run(client, message, args);


});
 
client.login(process.env.TOKEN);
