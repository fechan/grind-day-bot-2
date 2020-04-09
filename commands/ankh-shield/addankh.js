const ankhUtils = require('./ankhUtils.js')

module.exports = {
    name: 'addankh',
    description: 'Registers one or more Ankh Shield items with your Ankh Shield checklist.',
    args: true,
    usage: '<item>',
    async execute(message, args) {
        let ankhRole = message.member.roles.cache.find(role => role.name.startsWith('ankh_'));
        let flags;
        if (ankhRole !== undefined) { //if member already has a checklist
            let current = parseInt(ankhRole.name.substring(5));
            flags = ankhUtils.itemFlags(current, args, 'add');
        } else { //if member doesn't have a checklist
            flags = ankhUtils.itemFlags(0, args, 'add');
        }
        try {
            await ankhUtils.removeChecklists(message.member);
            await ankhUtils.giveChecklist(message.member, flags);
            await ankhUtils.cleanupRoles(message.guild);
            message.reply(ankhUtils.buildChecklistReply(flags));
        } catch (error) {
            message.reply("Unable to either create/delete roles or add/remove roles from users. Please check bot permissions.");
        }
    },
};