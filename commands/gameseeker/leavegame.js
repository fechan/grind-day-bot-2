module.exports = {
    name: 'leavegame',
    description: 'Leave a game with a given name.',
    usage: '<game_name>',
    execute(message, args) {
        if (args.length === 0) {
            message.reply("You didn't specify a game name!");
            return;
        }
        let name = args.join(' ');
        if (!name.startsWith('game_')) {
            message.reply("Game names must start with `game_`!");
            return;
        }
        let game = message.member.roles.cache.find(role => role.name === name);
        if (game === undefined) {
            message.reply(`You're not in a game called ${name}!`);
            return;
        }
        message.member.roles.remove(game, `Removing game role ${name} from ${message.member.nickname}`)
            .then(value => message.reply(`Successfully removed you from game ${name}.`),
                reason => message.reply(`Unable to remove you from game ${name}; check that the bot has adequate permissions.`))
            .then(result => {
                if (game.members.size === 0) {
                    message.reply(`Deleting game ${name} because it has no members left.`);
                    game.delete(`Deleted game role ${name} because it has no members left.`);
                }
            });
    },
};