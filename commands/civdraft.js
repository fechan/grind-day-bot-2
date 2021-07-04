const Commando = require('discord.js-commando');
const civ5Data = require('../data/civdata/civs.5.json');
const civ6Data = require('../data/civdata/civs.6.json');
const civ5List = civ5Data['civilizations'];
const civ6List = civ6Data['civilizations'];

module.exports = class CivdraftCommand extends Commando.Command {
    static command = true;
    static name = "civdraft";
    static group = "misc";
    constructor(client) {
        super(client, {
            name: CivdraftCommand.name,
            aliases: ['cdraft', 'civ'],
            group: CivdraftCommand.group,
            memberName: CivdraftCommand.name,
            description: 'Randomly pick Civ 5 or 6 civs. Supported <version>s are: 5, 6, 5vanilla, 6vanilla',
            args: [
                {
                    key: "version",
                    type: "string",
                    prompt: "What version of Civ do you want to draft from? (5, 6, 5vanilla, 6vanilla)"
                },
                {
                    key: "number",
                    type: "integer",
                    default: "10",
                    prompt: "How many civs do you want to draft?"
                }
            ]
        });
    }

    async run(message, args) {
        let chosen = [];
        let amount = 10;
        let version = args["version"];
        let allowedVersions = ['5', '6', '5vanilla', '6vanilla'];
        let civList;
        if (!allowedVersions.includes(version)) {
            message.reply("Invalid version! Allowed versions are: " + allowedVersions.join(", "));
            return;
        } else if (version.charAt(0) === '5'){
            civList = civ5List;
        } else if (version.charAt(0) === '6') {
            civList = civ6List;
        }
        if (version.includes('vanilla')) {
            civList = civList.filter(civ => civ.expansion.includes('Vanilla'));
        }
        if (args["number"]) {
            amount = parseInt(args["number"]);
            if (amount > civList.length) {
                message.reply(`There aren't even that many civs in Civ ${version}!`);
                return;
            }
        }
        let civDeck = [...civList];
        for (let i = 0; i < amount; i++) {
            let choice = civDeck.splice(Math.floor(Math.random()*civDeck.length), 1)[0]; //pop random
            chosen.push(choice);
        }
        let reply = `Randomly picked ${amount} civs:\n`;
        for (let civ of chosen) {
            let wikiLink = 'https://civilization.fandom.com/wiki/' +
                civ['nationPicturePath'].replace('.png', '');
            reply += `${civ['nationName']} - ${civ['leaderName']} (${wikiLink})\n`
        }
        message.reply(reply, {split:true});
    }
};