const Commando = require('discord.js-commando');
const glob = require('glob');
const defaultConfig = require('./config.defaults.json');
const config = require('./config.json');
const StaticSettingProvider = require('./StaticSettingProvider');

let allCommands = [];
let allListeners = [];

const commandFiles = glob.sync('./commands/**/*.js');
for (const file of commandFiles) {
    const command = require(file);
    if ("command" in command &&
            command.prototype instanceof Commando.Command) {
        console.log("Loaded " + command.name + " command");
        allCommands.push(command);
    }
}
const listenerFiles = glob.sync('./eventlisteners/*.js');
for (const file of listenerFiles) {
    const listener = require(file);
    if ("listener" in listener) {
        console.log("Loaded " + listener.name + " event listener");
        allListeners.push(listener);
    }
}

for (let botConfig of config) {
    botConfig = {...defaultConfig, ...botConfig}
    const client = new Commando.Client({
        owner: botConfig.ownerID,
        commandPrefix: process.argv.includes('--debug') ? botConfig.testPrefix : botConfig.prefix
    });
    
    client.setProvider(new StaticSettingProvider(botConfig));

    let allowedCommands = [];
    let allowedGroups = [];
    for (const command of allCommands) {
        if (botConfig.enabledCommands.includes(command.name)) {
            allowedCommands.push(command);
            allowedGroups.push(command.group);
        }
    }

    for (const listener of allListeners) {
        if (botConfig.enabledListeners.includes(listener.name)) {
            // Each listener object contains the callback to run when the event is fired
            // We want the callback to run with "this" set to the listener object, and NOT the bot client object
            // so we have to put it inside an arrow function. But we ALSO want to pass along whatever params Discord.js
            // passes to the callback, which changes depending on what kind of event the listener is for.
            // The first `...args` is a rest parameter, which turns Discord.js's event params into an array, then
            // the second `...args` destructures that array and turns it into regular parameters.
            // It's complicated, but luckily if you just want to write a listener, you don't have to care about how
            // it's being loaded.
            let listenerInstance = new listener(botConfig);
            client.on(listener.event, (...args) => listenerInstance.callback(...args));
            console.log(`${botConfig.configName}: loaded ${listener.name} listener`)
        }
    }

    client.once('ready', () => {
        client.user.setPresence({
            status: 'online',
            activity: {
                name: botConfig.status.gameName,
                type: botConfig.status.gameType
            }
        });
        client.registry
            .registerGroups(allowedGroups.map(groupName => [groupName, `${groupName} commands`]))
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: botConfig.enabledCommands.includes("help"),
                prefix: botConfig.enabledCommands.includes("prefix"),
                eval: botConfig.enabledCommands.includes("eval"),
                ping: botConfig.enabledCommands.includes("ping"),
                unknownCommand: botConfig.enabledCommands.includes("unknownCommand"),
                commandState: botConfig.enabledCommands.includes("commandState")
            })
            .registerCommands(
                allowedCommands,
                true // ignore invalid commands?
            );
        console.log(`${botConfig.configName}: loaded ${Array.from(client.registry.commands.keys()).join(", ")}`);
        console.log(`${botConfig.configName}: Ready!`);
    });
    
    if (process.argv.includes("--debug")) {
        console.warn(`${botConfig.configName}: (WARNING) Bot is running with --debug on and is using the test token!`);
        client.login(botConfig.testToken);
    } else {
        client.login(botConfig.token);
    }
}