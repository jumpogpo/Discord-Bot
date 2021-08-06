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
			const channel = client.channels.cache.get(msg.author.lastMessageChannelID);
            msg.delete();
            if (args[0] != null) {
                var Target = msg.guild.member(msg.mentions.users.first() || msg.guild.members.fetch(args[0]))
                var GuildMember = msg.guild.members.cache.get(Target.user.id)
                var MainChannel = GuildMember.voice.channel.id

                if (GuildMember.voice.channel != null && Target && GuildMember && MainChannel && msg.member.voice.channel != null) {
                    var ChannelID = []
                    var server = msg.guild;
                    var i = 0
					
					if (args[1] == null) {
						args[1] = 5
					}
					
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
							if (GuildMember != null && GuildMember.voice.channel != null) {
								GuildMember.voice.setChannel(ChannelID[getRandomInt(0, ChannelID.length)])
								i++;
								if (i <= Time) {
									Move()
								} else if (i > Time && GuildMember != null && MainChannel != null && GuildMember.voice.channel != null) {
									GuildMember.voice.setChannel(MainChannel)
								}
							}
                        }, 900)
                    }
                    
                    Move();
				}

            }
        }
    }
});


client.login('Nzg1MDc4NDMwMjI3MzY1OTA4.X8ynQw.BzEgvoHpYVCSWlYNTSpLgEPC3Os');