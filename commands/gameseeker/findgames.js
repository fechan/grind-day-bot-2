const Commando = require('discord.js-commando')

module.exports = class FingamesCommand extends Commando.Command {
    static command = true;
    static name = "findgames";
    static group = "gameseeker";

    constructor(client) {
        super(client, {
            name: FingamesCommand.name,
            group: FingamesCommand.group,
            memberName: FingamesCommand.name,
            description: 'Finds games where everyone is online.'
        });
    }

    async run(message, args) {
        let gameRoles = message.guild.roles.cache.filter(role => role.name.startsWith('game_'));
        let onlineGames = [];
        for (let [roleId, role] of gameRoles) {
            let allOnline = true;
            if (role.members.size === 0) {
                allOnline = false;
            } else {
                for (let [memberId, member] of role.members) {
                    if (member.presence.status != "online") {
                        allOnline = false;
                        break;
                    }
                }
            }
            if (allOnline) {
                onlineGames.push(role);
            }
        }
        let reply;
        if (onlineGames.length > 0) {
            reply = "Found the following games where everyone is online:";
            for (let game of onlineGames) {
                reply += `\n${game.name} (${game.members.size} players)`;
            }
        } else {
            reply = "No games found where everyone is online."
        }
        message.reply(reply);
    }
};