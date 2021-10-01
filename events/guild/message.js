const { prefix } = require(`../../setting.json`)

module.exports = (Discord, client, message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (command) {
        command.execute(message, args, cmd, client, Discord);
    }
}