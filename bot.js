const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log("Loaded " + command.name + " command");
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log("Ready!");
    client.user.setPresence({
        status: 'online',
        game: {
            name: config.status.gameName,
            type: config.status.gameType
        }
    });
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    //Find command or its alias
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        message.reply("command not found: " + commandName);
        return;
    }

    //Incorrect number of arguments
    if (command.args && !args.length) {
        let reply = `incorrect number of arguments. `;
        if (command.usage) {
            reply += `Usage: \`\`\`${config.prefix}${command.name} ${command.usage}\`\`\``;
        }
        return message.reply(reply);
    }

    //Try executing command
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
    }
});

client.login(config.token);
