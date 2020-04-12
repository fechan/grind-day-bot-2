const Discord = require('discord.js');
const glob = require('glob');
const config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = glob.sync('./commands/**/*.js');
for (const file of commandFiles) {
    const command = require(file);
    console.log("Loaded " + command.name + " command");
    client.commands.set(command.name, command);
}
const listenerFiles = glob.sync('./eventlisteners/*.js');
for (const file of listenerFiles) {
    const listener = require(file);
    console.log("Loaded " + listener.name + " event listener");
    client.on(listener.event, listener.callback);
}


client.once('ready', () => {
    console.log("Ready!");
    client.user.setPresence({
        status: 'online',
        activity: {
            name: config.status.gameName,
            type: config.status.gameType
        }
    });
});

client.on('message', message => {
    let prefix = process.argv.includes('--debug') ? config.testPrefix : config.prefix;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
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
            reply += `Usage: \`\`\`${prefix}${command.name} ${command.usage}\`\`\``;
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

if (process.argv.includes("--debug")) {
    console.log("WARNING: Bot is running with --debug on and is using the test token!");
    client.login(config.testToken);
} else {
    client.login(config.token);
}