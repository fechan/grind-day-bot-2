const ankhUtils = require('./ankhUtils.js')

module.exports = {
    name: 'eraseankh',
    description: 'Deletes your ankh checklist.',
    async execute(message, args) {
        try {
            await ankhUtils.removeChecklists(message.member);
            await ankhUtils.cleanupRoles(message.guild);
            message.reply("Successfully deleted your Ankh Shield checklist");
        } catch (error) {
            message.reply("Unable to either delete roles or remove roles from users. Please check bot permissions.");
        }
    },
};