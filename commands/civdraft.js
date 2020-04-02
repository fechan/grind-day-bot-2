const civ5Data = require('../data/civdata/civs.5.json');
const civ6Data = require('../data/civdata/civs.6.json');
const civ5List = civ5Data['civilizations'];
const civ6List = civ6Data['civilizations'];

module.exports = {
    name: 'civdraft',
    aliases: ['cdraft', 'civ'],
    usage: '<version> OPTIONAL: (number)',
    description: 'Randomly pick Civ 5 or 6 civs. Supported <version>s are: 5, 6, 5vanilla, 6vanilla',
    execute(message, args) {
        let chosen = [];
        let amount = 10;
        let version = args[0];
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
        if (args[1]) {
            amount = parseInt(args[1]);
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
    },
};