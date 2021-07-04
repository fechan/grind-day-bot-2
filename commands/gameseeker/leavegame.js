const Commando = require('discord.js-commando')

module.exports = class LeavegameCommand extends Commando.Command {
    static command = true;
    static name = "leavegame";
    static group = "gameseeker";

    constructor(client) {
        super(client, {
            name: LeavegameCommand.name,
            group: LeavegameCommand.group,
            memberName: LeavegameCommand.name,
            description: 'leave a game with a given game name.',
            args: [
                {
                    key: "game_name",
                    type: "string",
                    infinite: true,
                    prompt: "What's the name of the game you want to leave?"
                }
            ]
        });
    }

    async run(message, args) {
        let name = args["game_name"].join(' ');
        if (!name.startsWith('game_')) name = "game_" + name;
        let game = message.member.roles.cache.find(role => role.name === name);
        if (game === undefined) {
            message.reply(`You're not in a game called ${name}!`);
            return;
        }
        message.member.roles.remove(game, `Removing game role ${name} from ${message.member.nickname}`)
            .then(value => message.reply(`Successfully removed you from ${name}.`),
                reason => message.reply(`Unable to remove you from ${name}; check that the bot has adequate permissions.`))
            .then(result => {
                if (game.members.size === 0) {
                    message.reply(`Deleting ${name} because it has no members left.`);
                    game.delete(`Deleted game role ${name} because it has no members left.`);
                }
            });
    }
};