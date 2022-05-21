const Language = require('./language.json');

const { MessageEmbed } = require('discord.js');
const ffmpeg = require("ffmpeg-static");
const opus = require("opusscript");
const ytdl = require('ytdl-core');
const { YouTube } = require('popyt');
const fetch = require('node-fetch');
const ytpl = require('ytpl');

class MusicBot {
    /**
     * @typedef {object} Options
     * @property {string} ytApiKey - Your YouTube API key.
     * @property {string} botClient - The Discord.Client();
     * @property {string} botPrefix - Your Discord bot prefix.
     * @param {Options} options
     */
    constructor(options) {

        this.errorMsg = '> \x1b[33m[Discord Music System], \x1b[31mError: \x1b[37m ';
        this.interErrorMsg = '> \x1b[33m[Discord Music System], \x1b[31mIntern Error: \x1b[37m ';
        this.warnMsg = '> \x1b[33m[Discord Music System], \x1b[31mWarning \x1b[37m ';

        if (!options.ytApiKey) {
            throw new Error(this.errorMsg + 'The YouTube API key is required.');
        };
        if (!options.botClient) {
            throw new Error(this.errorMsg + 'The Discord.Client() integration is required.');
        };
        if (!options.botPrefix) {
            throw new Error(this.errorMsg + 'The bot prefix is required.');
        };

        this.prefix = options.botPrefix;
        this.apiKey = options.ytApiKey;
        this.queue = new Map();
        this.client = options.botClient;
        this.messagesReactions = new Map();
        this.playlistQueue = new Map();

        this.messages = {
            noPrivateMessages: Language.messages.noPrivateMessages || 'I do not reply to private messages.',
            voiceChannelNeeded: Language.messages.voiceChannelNeeded || 'You need to be in a voice channel to use this command.',
            cannotConnect: Language.messages.cannotConnect || 'I cannot connect to your voice channel, make sure I have the proper permissions!',
            noArgs: Language.messages.noArgs || 'You have to enter a search term.',
            sameVoiceChannel: Language.messages.sameVoiceChannel || 'You must be in the same vocal channel as the bot to be able to listen to music.',
            nothingPlaying: Language.messages.nothingPlaying || 'There is nothing currently playing.',
            noMoreSongs: Language.messages.noMoreSongs || 'There is no more songs in the playlist.',
            volBeetween: Language.messages.volBeetween || 'Volume must be a number between `0` and `100`!',
            validNumberPosition: Language.messages.validNumberPosition || 'The position must be a valid number higher than \`0\`.',
            couldNotBeFound: Language.messages.couldNotBeFound || 'This sound could not be found.',
            restrictedOrNotFound: Language.messages.restrictedOrNotFound || 'This song is restricted or could not be found!',
            hasBeenAdded: Language.messages.hasBeenAdded || 'has been added to the queue.',
            errorWhileParsingVideo: Language.messages.errorWhileParsingVideo || 'An error occured while searching the video.',
            errorWhileParsingPlaylist: Language.messages.errorWhileParsingPlaylist || 'An error occured while parsing the playlist songs.',
        };

        this.embeds = {
            createdMusicPlayer: {
                title: Language.embeds.createdMusicPlayer.title || 'Info',
                description: Language.embeds.createdMusicPlayer.description || 'The `music player` has been **created**!',
            },
            nowPlaying: {
                title: Language.embeds.nowPlaying.title || 'Now playing',
                videoLink: Language.embeds.nowPlaying.videoLink || 'Video link',
                channelLink: Language.embeds.nowPlaying.channelLink || 'Channel link',
                remainingTime: Language.embeds.nowPlaying.remainingTime || 'Time remaining:',
                live: Language.embeds.nowPlaying.live || '◉ LIVE',
            },
            skipSong: {
                askedBy: Language.embeds.skipSong.askedBy || 'Asked by',
                beenSkipped: Language.embeds.skipSong.beenSkipped || 'has been skipped',
            },
            volumeEmbed: {
                title: Language.embeds.volumeEmbed.title || '🔊 Volume',
                changedFrom: Language.embeds.volumeEmbed.changedFrom || 'Changed from',
                to: Language.embeds.volumeEmbed.to || 'to',
            },
            pauseEmbed: {
                title: Language.embeds.pauseEmbed.title || 'Info',
                description: Language.embeds.pauseEmbed.description || '**⏸ Paused the music.**',
                askedBy: Language.embeds.pauseEmbed.askedBy || 'Asked by',
            },
            resumeEmbed: {
                title: Language.embeds.resumeEmbed.title || 'Info',
                description: Language.embeds.resumeEmbed.description || '**▶ Resumed the music.**',
                askedBy: Language.embeds.resumeEmbed.askedBy || 'Asked by',
            },
            removeEmbed: {
                title: Language.embeds.removeEmbed.title || '🚫 Removed',
                removedBy: Language.embeds.removeEmbed.removedBy || '🔎 Removed by',
                published: Language.embeds.removeEmbed.published || 'Published',
                views: Language.embeds.removeEmbed.views || 'Views',
            },
            errorEmbed: {
                title: Language.embeds.errorEmbed.title || 'Error',
            },
            playerDestroyedEmbed: {
                author: Language.embeds.playerDestroyedEmbed.author || "Info",
                description: Language.embeds.playerDestroyedEmbed.description || "The `music player` has been **destroyed**!"
            },
            playEmbed: {
                addedBy: Language.embeds.playEmbed.addedBy || "🔎 Added by",
                luckySearch: Language.embeds.playEmbed.luckySearch || "with lucky search.",
                published: Language.embeds.playEmbed.published || "Published",
                views: Language.embeds.playEmbed.views || "Views"
            },
            queueEmbed: {
                queue: Language.embeds.queueEmbed.queue || 'queue',
            },
            lyricsEmbed: {
                searching: Language.embeds.lyricsEmbed.searching || "Searching...",
                askedBy: Language.embeds.lyricsEmbed.askedBy || "Asked by "
            },
            addEmbed: {
                playlist: Language.embeds.addEmbed.playlist || "The playlist",
                hasBeenAdded: Language.embeds.addEmbed.hasBeenAdded || "has been added to the queue."
            }
        };

        this.activity = {
            nothing: Language.presence.nothing || '🎵 Nothing',
        };
    };

    /**
     * @api public
     * @param {message} message The message from your discord code.
     * @example
     */
    async onMessage(message) {
        if (!message) {
            throw new Error(this.errorMsg + 'The message is required on the onMessage function.');
        };

        if (message.channel.type === 'dm') {
            return this.sendErrorEmbed(this.messages.noPrivateMessages, message);
        };

        const args = message.content.split(' ').slice(1).join(' ');

        /*
        Play command
        */
        if (message.content.startsWith(this.prefix + 'play') || message.content.startsWith(this.prefix + 'add') || message.content.startsWith(this.prefix + 'join')) {
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            const permissions = message.member.voice.channel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return this.sendErrorEmbed(this.messages.cannotConnect, message);
            };

            if (!args) {
                return this.sendErrorEmbed(this.messages.noArgs, message);
            };

            const serverQueue = this.queue.get(message.guild.id);

            if (!serverQueue) {
                message.channel.send(new MessageEmbed().setColor(0x03a9f4).setAuthor(this.embeds.createdMusicPlayer.title).setDescription(this.embeds.createdMusicPlayer.description));
            };

            if (serverQueue && !this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            if (this.isYouTubePlaylistURL(args)) {
                await this.playPlaylist(args, message);
            }

            if (this.isYouTubeVideoURL(args)) {
                return this.playVideoUrl(args, message);
            };

            if (!this.isYouTubePlaylistURL(args) && !this.isYouTubeVideoURL(args)) {
                return this.playQuery(args, message);
            };
        };

        /*
        Stop command
        */
        if (message.content === (this.prefix + 'stop') || message.content === (this.prefix + 'kill') || message.content === (this.prefix + 'destroy') || message.content === (this.prefix + 'leave')) {
            const serverQueue = this.queue.get(message.guild.id);
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            serverQueue.songs = [];

            if (serverQueue.playing === true) {
                serverQueue.connection.dispatcher.end();
                message.member.voice.channel.leave();
            } else {
                serverQueue.playing === true
                await serverQueue.connection.dispatcher.resume();
                await serverQueue.connection.dispatcher.end();
                await message.member.voice.channel.leave();
            };

            serverQueue.textChannel.messages.fetch({ limit: 1, around: this.messagesReactions.get(serverQueue.textChannel.guild.id) }).then(async messages => {
                await messages.first().reactions.removeAll().catch(console.error);
                await this.messagesReactions.delete(serverQueue.textChannel.guild.id);
            });
        };

        /*
        Lyrics command
        */
        if (message.content.startsWith(this.prefix + 'lyrics')) {
            const serverQueue = this.queue.get(message.guild.id);
            if (serverQueue) {
                return await this.getSongLyrics(serverQueue.songs[0].title, message);
            };

            if (!serverQueue) {
                if (!args) {
                    return this.sendErrorEmbed(this.messages.noArgs, message);
                };
                await this.getSongLyrics(args, message);
            };
        };

        /*
        Now playing command
        */
        if (message.content.startsWith(this.prefix + 'np') || message.content.startsWith(this.prefix + 'nowplaying') || message.content.startsWith(this.prefix + 'current')) {
            const serverQueue = this.queue.get(message.guild.id);
            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            const song = serverQueue.songs[0];
            const seek = (serverQueue.connection.dispatcher.streamTime - serverQueue.connection.dispatcher.pausedTime) / 1000;
            const left = song.duration - seek;

            let nowPlaying = new MessageEmbed()
                .setAuthor(this.embeds.nowPlaying.title)
                .setDescription(`\`${song.title}\`\n**[${this.embeds.nowPlaying.videoLink}](${song.url}) | [${this.embeds.nowPlaying.channelLink}](${song.authorUrl})**`)
                .setColor(0x03a9f4)
                .setThumbnail(song.thumbnailUrl)
                .addField("\u200b", '`▶ ' + new Date(seek * 1000).toISOString().substr(11, 8) + ' [' + this.progressBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] + '] ' + (song.duration == 0 ? ` ${this.embeds.nowPlaying.live}` : new Date(song.duration * 1000).toISOString().substr(11, 8)) + '`');

            if (song.duration > 0) {
                nowPlaying.setFooter(`${this.embeds.nowPlaying.remainingTime} ` + new Date(left * 1000).toISOString().substr(11, 8));
            };

            return message.channel.send(nowPlaying);
        };

        /*
        Skip command
        */
        if (message.content.startsWith(this.prefix + 'skip') || message.content.startsWith(this.prefix + 'next') || message.content.startsWith(this.prefix + '>>')) {
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            const serverQueue = this.queue.get(message.guild.id);
            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            if (!serverQueue.songs[1]) {
                return this.sendErrorEmbed(this.messages.noMoreSongs, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            serverQueue.connection.dispatcher.end();
            serverQueue.textChannel.messages.fetch({ limit: 1, around: this.messagesReactions.get(message.guild.id) }).then(async messages => {
                await messages.first().reactions.removeAll().catch(console.error);
                await this.messagesReactions.delete(message.guild.id);
            });

            message.channel.send(new MessageEmbed().setColor(0x03a9f4).setFooter(`${this.embeds.skipSong.askedBy} ` + message.author.tag, message.author.displayAvatarURL()).setDescription('⏩ `' + serverQueue.songs[0].title + `\` ${this.embeds.skipSong.beenSkipped}`));
        };

        /*
        Queue command
        */
        if (message.content.startsWith(this.prefix + 'queue') || message.content.startsWith(this.prefix + 'q') || message.content.startsWith(this.prefix + 'playlist')) {
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            const serverQueue = this.queue.get(message.guild.id);
            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            if (!serverQueue.songs[1]) {
                return this.sendErrorEmbed(this.messages.noMoreSongs, message);
            };

            return this.sendQueueEmbed(serverQueue, message);
        };

        /*
        Volume command
        */
        if (message.content.startsWith(this.prefix + 'volume') || message.content.startsWith(this.prefix + 'setvolume')) {
            const serverQueue = this.queue.get(message.guild.id);
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message)
            };

            const volumeNumber = parseInt(args, 10);
            if (!isNaN(volumeNumber) && (volumeNumber >= 0 && volumeNumber <= 100)) {
                message.channel.send(new MessageEmbed().setColor(0x03a9f4).setAuthor(this.embeds.volumeEmbed.title).setDescription(`${this.embeds.volumeEmbed.changedFrom} \`${serverQueue.volume * 100}\` ${this.embeds.volumeEmbed.to} \`${volumeNumber}\``));
                serverQueue.volume = volumeNumber / 100;
                if (serverQueue.connection.dispatcher) {
                    serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume);
                };
            } else {
                return this.sendErrorEmbed(this.messages.volBeetween, message);
            };
        };

        /*
        Pause command
        */
        if (message.content.startsWith(this.prefix + 'pause')) {
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            const serverQueue = this.queue.get(message.guild.id);
            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message)
            };

            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return message.channel.send(new MessageEmbed().setAuthor(this.embeds.pauseEmbed.title).setColor(0x03a9f4).setDescription(this.embeds.pauseEmbed.description).setFooter(`${this.embeds.pauseEmbed.askedBy} ` + message.author.tag, message.author.displayAvatarURL()));
            };
        };

        /*
        Resume command
        */
        if (message.content.startsWith(this.prefix + 'resume')) {
            if (!message.member.voice.channel) {
                return this.sendErrorEmbed(this.messages.voiceChannelNeeded, message);
            };

            if (!this.sameVoiceChannel(message.member)) {
                return this.sendErrorEmbed(this.messages.sameVoiceChannel, message);
            };

            const serverQueue = this.queue.get(message.guild.id);
            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return message.channel.send(new MessageEmbed().setAuthor(this.embeds.resumeEmbed.title).setColor(0x03a9f4).setDescription(this.embeds.resumeEmbed.description).setFooter(`${this.embeds.resumeEmbed.askedBy} ` + message.author.tag, message.author.displayAvatarURL()));
            };
        };

        /*
        Remove command
        */
        if (message.content.startsWith(this.prefix + 'remove') || message.content.startsWith(this.prefix + 'delete')) {
            const serverQueue = this.queue.get(message.guild.id);
            if (!serverQueue) {
                return this.sendErrorEmbed(this.messages.nothingPlaying, message);
            };

            if (!serverQueue.songs[1]) {
                return this.sendErrorEmbed(this.messages.noMoreSongs, message);
            };

            const index = parseInt(args, 10);
            if (!isNaN(index) && index >= 1 && serverQueue.songs.length > index) {
                message.channel.send(new MessageEmbed().setAuthor(this.embeds.removeEmbed.title).setColor(0x03a9f4).setDescription(`[${serverQueue.songs[index].author}](${serverQueue.songs[index].authorUrl})\n**[${serverQueue.songs[index].title}](${serverQueue.songs[index].url})**\n\`${this.embeds.removeEmbed.removedBy} ${message.author.username}.\``).addField(this.embeds.removeEmbed.published, '`' + serverQueue.songs[index].published + '`', true).addField(this.embeds.removeEmbed.views, '`' + serverQueue.songs[index].views + '`', true).setFooter(this.client.user.username, this.client.user.displayAvatarURL()));
                serverQueue.songs.splice(index, 1);
            } else {
                this.sendErrorEmbed(this.messages.validNumberPosition, message);
            };
        };
    };

    /**
     * @api private
     * @param {url} url The video url from the message
     * @param {videoClass} videoClass Check if the url in a video URL
     */
    isYouTubeVideoURL(url, videoClass = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi) {
        if (!url) {
            throw new Error(this.interErrorMsg + 'The URL is required on the isYouTubeVideoURL function.');
        };

        if (videoClass.test(url)) {
            return true;
        } else {
            return false;
        };
    };

    /**
     * @api private
     * @param {url} url The video url from the message
     * @param {playlistClass}  playlistClass Check if the url in a playlist URL
     */
    isYouTubePlaylistURL(url, playlistClass = /^.*(list=)([^#\&\?]*).*/gi) {
        if (!url) {
            throw new Error(this.interErrorMsg + 'The URL is required on the isYouTubePlaylistURL function.');
        };

        if (playlistClass.test(url)) {
            return true;
        } else {
            return false;
        };
    };

    /**
     * @api private
     * @param {totalTime} totalTime The total video time
     * @param {currentTime} currentTime The current time in the video progression
     */
    progressBar(totalTime, currentTime, barSize = 20, line = '▬', slider = '🔘') {
        if (!totalTime) {
            throw new Error(this.interErrorMsg + 'The total time is required on the progressBar function.');
        };

        if (!currentTime) {
            throw new Error(this.interErrorMsg + 'The current time is required on the progressBar function.');
        };

        if (currentTime > totalTime) {
            const bar = line.repeat(barSize + 2);
            const percentage = (currentTime / totalTime) * 100;
            return [bar, percentage];
        } else {
            const percentage = currentTime / totalTime;
            const progress = Math.round((barSize * percentage));
            const emptyProgress = barSize - progress;
            const progressText = line.repeat(progress).replace(/.$/, slider);
            const emptyProgressText = line.repeat(emptyProgress);
            const bar = progressText + emptyProgressText;
            const calculated = percentage * 100;
            return [bar, calculated];
        };
    };

    /**
     * @api private
     * @param {errorMessage} errorMessage The message to send in the error embed.
     * @param {message} The original message, from 'onMessage()' function.
     */
    sendErrorEmbed(errorMessage, message) {
        if (!errorMessage) {
            throw new Error(this.interErrorMsg + 'The error message is required on the sendErrorEmbed function.');
        };

        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the sendErrorEmbed function.');
        };

        return message.channel.send(new MessageEmbed().setColor(0xf04947).setDescription(errorMessage));
    };

    /**
     * @api private
     * @param {args} args The args to find the video.
     * @param {message} message The original message, from 'onMessage()' function.
     */
    async playQuery(args, message) {
        if (!args) {
            throw new Error(this.interErrorMsg + 'The args are required on the playQuery function.');
        };

        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the playQuery function.');
        };

        const youtube = new YouTube(this.apiKey);
        const infos = await youtube.searchVideos(args, 1);
        if (infos.results.length === 0) {
            return this.sendErrorEmbed(this.messages.couldNotBeFound, message);
        };

        const serverQueue = this.queue.get(message.guild.id);
        const songInfo = await ytdl.getInfo(infos.results[0].url);
        if (!songInfo) {
            return this.sendErrorEmbed(this.messages.restrictedOrNotFound, message);
        };

        const song = { id: songInfo.videoDetails.video_id, title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, author: songInfo.videoDetails.author.name, authorUrl: songInfo.videoDetails.author.channel_url, duration: songInfo.videoDetails.lengthSeconds, thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop().url, published: songInfo.videoDetails.publishDate, views: songInfo.player_response.videoDetails.viewCount };
        if (serverQueue) {
            await serverQueue.songs.push(song);
            return await message.channel.send(new MessageEmbed().setColor(0x03a9f4).setThumbnail(song.thumbnailUrl).setDescription(`<a:yes:615983179341496321> **|** \`${song.title}\` ${this.messages.hasBeenAdded}`));
        };

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: message.member.voice.channel,
            connection: null,
            songs: [],
            volume: 0.5,
            playing: true,
        };

        await this.queue.set(message.guild.id, queueConstruct);
        await queueConstruct.songs.push(song);
        try {
            const connection = await message.member.voice.channel.join();
            queueConstruct.connection = connection;
            this.playSong(queueConstruct.songs[0], message, serverQueue);
        } catch (error) {
            this.queue.delete(message.guild.id);
            await message.member.voice.channel.leave();
            //await this.updateClientPresence(message);
            return this.sendErrorEmbed(`${this.messages.cannotConnect} \`${error}\``, message);
        };
    };

    /**
     * @api private
     * @param {song} song The song, with all it informations (title, author...).
     * @param {message} message The original message, from 'onMessage()' function.
     * @param {serverQueue} serverQueue The serverQueue, using the map.
     */
    async playSong(song, message, serverQueue) {
        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the playSong function.');
        };

        const queue = this.queue.get(message.guild.id);
        if (!song) {
            await queue.voiceChannel.leave();
            await this.queue.delete(message.guild.id);
            //await this.updateClientPresence(message);
            return await message.channel.send(new MessageEmbed().setColor(0x03a9f4).setAuthor(this.embeds.playerDestroyedEmbed.author).setDescription(this.embeds.playerDestroyedEmbed.description));
        };
        message.guild.me.voice.setSelfDeaf(true);
        const dispatcher = queue.connection.play(ytdl(song.url))
            .on('finish', async () => {
                queue.songs.shift();
                this.playSong(queue.songs[0], message, serverQueue);
                //await this.updateClientPresence(message);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume);
        if (!serverQueue) {
            //this.updateClientPresence(message);
            var playingMessage = await queue.textChannel.send(new MessageEmbed().setColor(0x03a9f4).setDescription(`[${song.author}](${song.authorUrl})\n**[${song.title}](${song.url})**\n\`${this.embeds.playEmbed.addedBy} ${message.author.username} ${this.embeds.playEmbed.luckySearch}\``).addField(this.embeds.playEmbed.published, '`' + song.published + '`', true).addField(this.embeds.playEmbed.views, '`' + song.views + '`', true))
            await this.musicMessageReact(playingMessage);
            await this.reactionsMessageSystem(playingMessage, queue, song, message);
        };
    };

    /**
     * @api private
     * @param {args} args The song title
     * @param {message} message The original message, from 'onMessage()' function.
     */
    async getSongLyrics(args, message) {
        if (!args) {
            throw new Error(this.interErrorMsg + 'The args are required on the getSongLyrics function.');
        };

        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the getSongLyrics function.');
        };

        var msg = await message.channel.send(new MessageEmbed().setAuthor(this.embeds.lyricsEmbed.searching, 'https://www.aerobusbcn.com/sites/all/themes/aerobus/images/ajax-loader.gif').setColor(0x03a9f4)) || message.send(new MessageEmbed().setAuthor(this.embeds.lyricsEmbed.searching, 'https://www.aerobusbcn.com/sites/all/themes/aerobus/images/ajax-loader.gif').setColor('YELLOW'));
        var res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(args)}`)
        var lyrics = await res.json()
        if (lyrics.error) {
            return msg.edit(new MessageEmbed().setColor(0xf04947).setDescription(this.messages.couldNotBeFound));
        };

        if (lyrics.lyrics.length >= 2048) {
            var cut = lyrics.lyrics.length - 2000
            lyrics.lyrics = lyrics.lyrics.slice(0, 0 - cut) + '...'
        };

        return msg.edit(new MessageEmbed().setColor(0x03a9f4).setFooter(this.embeds.lyricsEmbed.askedBy + message.author.tag, message.author.displayAvatarURL()).setAuthor('📜 ' + lyrics.title).setDescription('`' + lyrics.lyrics + '`'))
    };

    /**
     * @api private
     * @param {serverQueue} serverQueue The serverQueue using the map.
     * @param {message} message The original message, from 'onMessage()' function.
     */
    async sendQueueEmbed(serverQueue, message) {
        if (!serverQueue) {
            throw new Error(this.interErrorMsg + 'The serverQueue is required on the sendQueueEmbed function.');
        };

        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the sendQueueEmbed function.');
        };

        const QueueEmbed = new MessageEmbed()
            .setColor(0x03a9f4)
            .setAuthor('🎹 `' + message.guild.name + '`' + this.embeds.queueEmbed.queue);
        for (let i = 1; i < serverQueue.songs.length && i < 26; i++) {
            QueueEmbed.addField(`\`#${i}\``, `**[${serverQueue.songs[i].title}](${serverQueue.songs[i].url})**`);
        };
        return message.channel.send(QueueEmbed);
    };

    /**
     * @api private
     * @param {member} member The member from the message.
     */
    sameVoiceChannel(member) {
        if (!member) {
            throw new Error(this.interErrorMsg + 'The member is required on the sameVoiceChannel function.');
        };

        if (member.voice.channel.id !== member.guild.voice.channelID) {
            return false;
        };

        return true;
    };

    /**
     * @api private
     * @param {member} member The member from the message.
     */
    canReact(member) {
        if (!member) {
            throw new Error(this.interErrorMsg + 'The member is required on the sameVoiceChannel function.');
        };

        if (member.voice.channel.id !== member.guild.voice.channelID) {
            return false;
        };

        return true;
    };

    /**
     * @api private
     * @param {message} message The embed music  message, with reactions.
     * @param {queue} queue The queue, using the map
     * @param {song} song The song found with ytdl-core
     * @param {basicMessage} basicMessage The original message, from 'onMessage()' function.
     */
    async reactionsMessageSystem(message, queue, song, basicMessage) {
        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the reactionMessageSystem function.');
        };

        if (!queue) {
            throw new Error(this.interErrorMsg + 'The queue is required on the reactionMessageSystem function.');
        };

        if (!song) {
            throw new Error(this.interErrorMsg + 'The song is required on the reactionMessageSystem function.');
        };

        if (!basicMessage) {
            throw new Error(this.interErrorMsg + 'The basicMessage is required on the reactionMessageSystem function.');
        };

        this.messagesReactions.set(message.guild.id, message.id);
        const filter = (reaction, user) => user.id !== this.client.user.id && reaction.emoji.name === '⏯' || reaction.emoji.name === '⏭' || reaction.emoji.name === '🔈' || reaction.emoji.name === '🔊' || reaction.emoji.name === '⏹'
        var collector = message.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000
        });
        collector.on('collect', async (reaction, user) => {
            if (!queue) {
                return;
            };
            const member = basicMessage.guild.member(user);
            switch (reaction.emoji.name) {
                case '⏯':
                    reaction.users.remove(user).catch(console.error);
                    if (!this.canReact(member)) {
                        return;
                    };
                    if (queue.playing) {
                        queue.playing = false;
                        queue.connection.dispatcher.pause();
                    } else {
                        queue.playing = true;
                        queue.connection.dispatcher.resume();
                    }
                    break;
                case '⏭':
                    reaction.users.remove(user).catch(console.error);
                    if (!this.canReact(member)) {
                        return;
                    };
                    if (queue.songs[1]) {
                        queue.connection.dispatcher.end();
                        collector.stop();
                    }
                    break;
                case '🔈':
                    reaction.users.remove(user).catch(console.error);
                    if (!this.canReact(member)) {
                        return;
                    };
                    if (queue.volume - 0.1 <= 0) {
                        queue.volume = 0;
                        queue.connection.dispatcher.setVolumeLogarithmic(queue.volume);
                    } else {
                        queue.volume = queue.volume - 0.1;
                        queue.connection.dispatcher.setVolumeLogarithmic(queue.volume);
                    }
                    break;
                case '🔊':
                    reaction.users.remove(user).catch(console.error);
                    if (!this.canReact(member)) {
                        return;
                    };
                    if (queue.volume + 0.1 >= 1) {
                        queue.volume = 1;
                        queue.connection.dispatcher.setVolumeLogarithmic(queue.volume);
                    } else {
                        queue.volume = queue.volume + 0.1;
                        queue.connection.dispatcher.setVolumeLogarithmic(queue.volume);
                    }
                    break;
                case '⏹':
                    if (!this.canReact(member)) {
                        return reaction.users.remove(user).catch(console.error);
                    };
                    queue.songs = [];
                    if (queue.playing === true) {
                        queue.connection.dispatcher.end();
                        basicMessage.member.voice.channel.leave();
                        collector.stop();
                        this.messagesReactions.delete(message.guild.id);
                        //await this.updateClientPresence(message);
                    } else {
                        queue.playing === true
                        await queue.connection.dispatcher.resume();
                        await queue.connection.dispatcher.end();
                        await basicMessage.member.voice.channel.leave();
                        collector.stop();
                        this.messagesReactions.delete(message.guild.id);
                        //await this.updateClientPresence(message);
                    };
                    break;
                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            };
        });
        collector.on('end', () => {
            message.reactions.removeAll().catch(console.error);
            this.messagesReactions.delete(message.guild.id);
        });
    };


    /**
     * @api private 
     * @param {url} url The video URL, to verify it.
     * @param {message} message The original message, from 'onMessage()' function.
     */
    async playVideoUrl(url, message) {
        if (!url) {
            throw new Error(this.interErrorMsg + 'The url is required on the playVideoUrl function.');
        };

        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the playVideoUrl function.');
        };

        const serverQueue = this.queue.get(message.guild.id);
        if (serverQueue && serverQueue.songs && serverQueue.playing) {
            const songInfo = await ytdl.getInfo(url);
            if (!songInfo) {
                return this.sendErrorEmbed(this.messages.errorWhileParsingVideo, message);
            };

            const song = { id: songInfo.videoDetails.video_id, title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, author: songInfo.videoDetails.author.name, authorUrl: songInfo.videoDetails.author.channel_url, duration: songInfo.videoDetails.lengthSeconds, thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop().url, published: songInfo.videoDetails.publishDate, views: songInfo.player_response.videoDetails.viewCount };
            serverQueue.songs.push(song);
            return await message.channel.send(new MessageEmbed().setColor(0x03a9f4).setThumbnail(song.thumbnailUrl).setDescription(`**\`${song.title}\`** ${this.embeds.addEmbed.hasBeenAdded}`));
        } else {
            const songInfo = await ytdl.getInfo(url);
            if (!songInfo) {
                return this.sendErrorEmbed(this.messages.errorWhileParsingVideo, message);
            };

            const song = { id: songInfo.videoDetails.video_id, title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, author: songInfo.videoDetails.author.name, authorUrl: songInfo.videoDetails.author.channel_url, duration: songInfo.videoDetails.lengthSeconds, thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop().url, published: songInfo.videoDetails.publishDate, views: songInfo.player_response.videoDetails.viewCount };
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: message.member.voice.channel,
                connection: null,
                songs: [],
                volume: 0.5,
                playing: true,
                loop: false
            };
            this.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
                const connection = await message.member.voice.channel.join();
                queueConstruct.connection = connection;
                this.playSong(song, message, serverQueue);
            } catch (error) {
                this.queue.delete(message.guild.id);
                await message.member.voice.channel.leave();
                //await this.updateClientPresence(message);
                return this.sendErrorEmbed(`${this.messages.cannotConnect} \`${error}\``, message);
            };
        };
    };


    /**
     * @api private
     * @param {query} query The args: search term in YouTube.
     * @param {message} message The original message, from 'onMessage()' function.
     */
    async playPlaylist(query, message) {
        if (!query) {
            throw new Error(this.interErrorMsg + 'The query is required on the playPlaylist function.');
        };

        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the playPlaylist function.');
        };

        const serverQueue = this.queue.get(message.guild.id);
        if (ytpl.validateID(query)) {
            const playlistID = await ytpl.getPlaylistID(query).catch(console.error);
            if (playlistID) {
                const playlist = await ytpl(playlistID).catch(console.error);
                if (playlist) {
                    const queueConstruct = {
                        textChannel: message.channel,
                        voiceChannel: message.member.voice.channel,
                        connection: null,
                        songs: [],
                        volume: 0.5,
                        playing: true,
                    };
                    if (serverQueue && serverQueue.playing) {
                        message.channel.send(new MessageEmbed().setColor(0x03a9f4).setThumbnail(playlist.items[0].thumbnail).setDescription(`${this.embeds.addEmbed.playlist} **\`${playlist.title}\`** ${this.embeds.addEmbed.hasBeenAdded}`));
                    };
                    (playlist.items.map(async (i) => {
                        if (serverQueue && serverQueue.playing === true) {
                            const songInfo = await ytdl.getInfo(i.url);
                            if (!songInfo) {
                                return this.sendErrorEmbed(this.messages.errorWhileParsingPlaylist, message);
                            };
                            const song = { id: songInfo.videoDetails.video_id, title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, author: songInfo.videoDetails.author.name, authorUrl: songInfo.videoDetails.author.channel_url, duration: songInfo.videoDetails.lengthSeconds, thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop().url, published: songInfo.videoDetails.publishDate, views: songInfo.player_response.videoDetails.viewCount };
                            return serverQueue.songs.push(song);
                        } else {
                            const songInfo = await ytdl.getInfo(i.url);
                            if (!songInfo) {
                                return this.sendErrorEmbed(this.messages.errorWhileParsingPlaylist, message);
                            };
                            const song = { id: songInfo.videoDetails.video_id, title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url, author: songInfo.videoDetails.author.name, authorUrl: songInfo.videoDetails.author.channel_url, duration: songInfo.videoDetails.lengthSeconds, thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop().url, published: songInfo.videoDetails.publishDate, views: songInfo.player_response.videoDetails.viewCount };
                            queueConstruct.songs.push(song);
                            this.queue.set(message.guild.id, queueConstruct);
                        };
                    }));
                    if (!serverQueue) {
                        try {
                            const connection = await message.member.voice.channel.join();
                            queueConstruct.connection = connection;
                            this.playSong(queueConstruct.songs[0], message, serverQueue);
                        } catch (error) {
                            this.queue.delete(message.guild.id);
                            await message.member.voice.channel.leave();
                            //await this.updateClientPresence(message);
                            return this.sendErrorEmbed(`${this.messages.cannotConnect} \`${error}\``, message);
                        };
                    };
                };
            };
        };
    };

    /**
     * @api private
     * @param {message} message The playingMessage embed, to add it reactions.
     */
    async musicMessageReact(message) {
        if (!message) {
            throw new Error(this.interErrorMsg + 'The message is required on the musicMessageReact function.');
        };

        await message.react('⏯');
        await message.react('⏭');
        await message.react('🔈');
        await message.react('🔊');
        await message.react('⏹');
    };
};

module.exports = MusicBot;