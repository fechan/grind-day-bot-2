const ankhUtils = require('./ankhUtils.js')

module.exports = {
    name: 'removeankh',
    description: 'Removes one or more Ankh Shield items from your Ankh Shield checklist.',
    aliases: ['delankh', 'rmankh'],
    args: true,
    usage: '<item>',
    async execute(message, args) {
        let ankhRole = message.member.roles.cache.find(role => role.name.startsWith('ankh_'));
        let flags;
        if (ankhRole !== undefined) { //if member already has a checklist
            let current = parseInt(ankhRole.name.substring(5));
            flags = ankhUtils.itemFlags(current, args, 'remove');
        } else { //if member doesn't have a checklist
            flags = ankhUtils.itemFlags(0, args, 'remove');
        }
        try {
            await ankhUtils.removeChecklists(message.member);
            if (flags !== 0) {
                await ankhUtils.giveChecklist(message.member, flags);
            }
            await ankhUtils.cleanupRoles(message.guild);
            message.reply(ankhUtils.buildChecklistReply(flags));
        } catch (error) {
            message.reply("Unable to either create/delete roles or add/remove roles from users. Please check bot permissions.");
        }
        
    },
};