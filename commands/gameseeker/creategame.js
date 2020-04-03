module.exports = {
    name: 'creategame',
    description: 'Creates a game with a given game name.',
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
        if (message.guild.roles.cache.find(role => role.name === name)) {
            message.reply(`A game with name ${name} already exists!`);
            return;
        }
        message.guild.roles.create({
            data: {
                name: name,
                mentionable: true
            },
            reason: `Creating game ${name}`
        })
            .then(value => message.reply(`Successfully created game ${name}.`),
                reason => message.reply(`Unable to create game ${name}; check that the bot has adequate permissions.`));
    },
};