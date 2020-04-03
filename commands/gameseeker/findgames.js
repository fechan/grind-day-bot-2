module.exports = {
    name: 'findgames',
    description: 'Finds games where everyone is online.',
    execute(message, args) {
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
    },
};