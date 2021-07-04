const Commando = require('discord.js-commando')

module.exports = class JoingameCommand extends Commando.Command {
    static command = true;
    static name = "joingame";
    static group = "gameseeker";

    constructor(client) {
        super(client, {
            name: JoingameCommand.name,
            group: JoingameCommand.group,
            memberName: JoingameCommand.name,
            description: 'Join a game with a given game name.',
            args: [
                {
                    key: "game_name",
                    type: "string",
                    infinite: true,
                    prompt: "What's the name of the game you want to join?"
                }
            ]
        });
    }

    async run(message, args) {
        let name = args["game_name"].join(' ');
        if (!name.startsWith('game_')) name = "game_" + name;
        let game = message.guild.roles.cache.find(role => role.name === name);
        if (game === undefined) {
            message.reply(`No game name exists called ${name}!`);
            return;
        }
        message.member.roles.add(game, `Adding ${message.member.nickname} to ${game.name}`)
            .then(value => message.reply(`Successfully added you to game ${name}.`),
                reason => message.reply(`Error adding role ${name}; check that the bot has adequate permissions.`)
            );
    }
};