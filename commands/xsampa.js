const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const XSAMPA = require('../util/xsampa-ipa');

module.exports = class XsampaCommand extends Commando.Command {
    static command = true;
    static 'name' = 'xsampa';
    static 'group' = 'misc';

    constructor(client) {
        super(client, {
            name: XsampaCommand.name,
            group: XsampaCommand.group,
            memberName: XsampaCommand.name,
            description: 'Convert X-SAMPA to IPA',
            args: [
                {
                    key: 'xsampa',
                    type: 'string',
                    infinite: true,
                    prompt: 'Please provide X-SAMPA text to convert.'
                }
            ]
        });
    }

    async run(message, args) {
        const xsampa = args.xsampa.join(' ');
        const ipa = XSAMPA.ipa(xsampa);
        const embed = new Discord.MessageEmbed()
            .setColor(0x00AE86)
            .setDescription(`**XSAMPA**\n${xsampa}\n\n**IPA**\n${ipa}`);
        return message.reply(embed);
    }
};