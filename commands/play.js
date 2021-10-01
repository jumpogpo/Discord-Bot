const ytdl = require('ytdl-core');
const ytSearch = require('yt-Search');

const queue = new Map();
const BoxSymbol = "``"

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'p', 's'],
    cooldown: 0,
    description: 'Advance music bot',

    async execute(message, args, cmd, client, Discord) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('คุณไม่ได้อยู่ในห้องพูดคุย');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel('Bot ไม่สามารถเข้าห้องได้');
        if (!permissions.has('SPEAK')) return message.channel.send('Bot ไม่สามารถพูดได้');

        const server_queue = queue.get(message.guild.id);

        if (cmd === 'play' || cmd === 'p') {
            if (!args.length) return message.channel.send('โปรดใส่ชื่อหรือลิ้งค์ของ Video');
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url};
            } else {
                const video_finder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url};
                } else {
                    message.channel.send('ไม่พบ Video');
                }
            }

            if (!server_queue){
                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    member_id: message.member.user.tag,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_constructor)
                queue_constructor.songs.push(song);
    
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('Error');
                    throw err;
                }
            } else{
                server_queue.songs.push(song);
                return message.channel.send(":white_check_mark: " + BoxSymbol + `${song.title}` + BoxSymbol + " added to queue! :white_check_mark: \n👉 Request By: " + BoxSymbol + message.member.user.tag + BoxSymbol + ' 👈')
            }
        }

        else if(cmd === 'skip' || cmd === 's') skip_song(message, server_queue);
        else if(cmd === 'stop') stop_song(message, server_queue);
    }
}

const video_player = async(guild, song) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
    });
	
    song_queue.connection.play(stream, { seak: 0, volume: 0.5})
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
	
    await song_queue.text_channel.send("🎵 Now playing: " + BoxSymbol + `${song.title}` + BoxSymbol + ' 🎵 \n👉 Request By: ' + BoxSymbol + song_queue.member_id + BoxSymbol + ' 👈')
}

const skip_song = async(message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('คุณไม่ได้อยู่ในห้องพูดคุย');
    if (!server_queue){
        return message.channel.send('ตอนนี้ Queue ว่างอยู่จะ Skip อะไรละ');
    }
    server_queue.connection.dispatcher.end();
    server_queue.text_channel.send("⏭️ Skipping: " + BoxSymbol + `${server_queue.songs[0].title}` + BoxSymbol + ' ⏮️ \n👉 Request By: ' + BoxSymbol + server_queue.member_id + BoxSymbol + ' 👈')
}

const stop_song = async(message, server_queue) => {
    if (!member.member.voice.channel) return message.channel.send('คุณไม่ได้อยู่ในห้องพูดคุย');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}