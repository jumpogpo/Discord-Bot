var axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();

const PREFIX = "!";

client.on('ready', () => {
    console.log("Bot is ready!!");
    client.user.setPresence({status: 'dnd'});
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

client.on('message', msg => {
    if (msg.author.bot) return

    if (msg.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = msg.content.trim().substring(PREFIX.length).split(/\s+/);

        if (CMD_NAME === 'poke' && msg.channel.type != 'dm') {
            msg.delete();
            if (args[0] != null && args[1] != null) {
                var Target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.fetch(args[0]))
                var GuildMember = msg.guild.members.cache.get(Target.user.id)

                if (Target && GuildMember && msg.member.voice.channel != null) {
                    var MainChannel = msg.member.voice.channel.id
                    var ChannelID = []
                    var server = msg.guild;
                    var i = 0
                    var Time = args[1]
    
                    for (const channel of server.channels.cache.array()) {
                        if (channel.type == 'voice' && channel.id != MainChannel) {
                            ChannelID.push(channel.id);
                        }
                    }
    
                    if (Time > 5) {
                        Time = 5
                    }
    
                    function Move() {
                        setTimeout(function() {
                            GuildMember.voice.setChannel(ChannelID[getRandomInt(0, ChannelID.length)])
                            i++;
                            if (i <= Time) {
                                Move();
                            } else if (i > Time) {
                                GuildMember.voice.setChannel(MainChannel)
                            }
                        }, 900)
                    }
                    
                    Move();
                }
            }
        }
    }
});

client.login(TOKEN);