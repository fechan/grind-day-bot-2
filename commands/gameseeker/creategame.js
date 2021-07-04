const Commando = require('discord.js-commando')

module.exports = class CreateGameCommand extends Commando.Command {
    static command = true;
    static name = "creategame";
    static group = "gameseeker";

    constructor(client) {
        super(client, {
            name: CreateGameCommand.name,
            group: CreateGameCommand.group,
            memberName: CreateGameCommand.name,
            description: 'Creates a game with a given game name.',
            args: [
                {
                    key: "game_name",
                    type: "string",
                    infinite: true,
                    prompt: "What's the name of the game you want to create?"
                }
            ]
        });
        this.prefix = client.settings.get("prefix");
    }

    async run(message, args) {
        let name = args["game_name"].join(" ");
        if (!name.startsWith('game_')) name = "game_" + name;
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
            .then(role => message.reply(`Successfully created ${role}. Type \`\`\`${this.prefix}joingame ${name}\`\`\` to join the game!`),
                reason => message.reply(`Unable to create ${name}; check that the bot has adequate permissions.`));
    }
};