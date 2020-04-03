module.exports = {
    name: 'joingame',
    description: 'Join a game with a given game name.',
    usage: '<game_name>',
    execute(message, args) {
        let name;
        if (args.length === 0) {
            message.reply("You didn't specify a game name!");
        } else {
            name = args.join(' ');
        }
        if (!name.startsWith('game_')) {
            message.reply("Game name must start with `game_`!");
            return;
        }
        let game = message.guild.roles.cache.find(role => role.name === name);
        if (game === null) {
            message.reply(`No game name exists called ${name}!`);
            return;
        }
        message.member.roles.add(game, `Adding ${message.member.nickname} to game ${game.name}`)
            .then(value => message.reply(`Successfully added you to game ${name}.`),
                reason => message.reply(`Error adding role ${name}; check that the bot has adequate permissions.`)
            );
    },
};