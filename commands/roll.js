const Commando = require('discord.js-commando')

module.exports = class RollCommand extends Commando.Command {
    static command = true;
    static name = "roll";
    static group = "misc"

    constructor(client) {
        super(client, {
            name: RollCommand.name,
            group: RollCommand.group,
            memberName: RollCommand.name,
            description: "Rolls dice in standard AdX+B dice notation",
            args: [
                {
                    key: "dice_notation",
                    type: "string",
                    prompt: "What do you want to roll? Use [AdX+B dice notation](https://en.wikipedia.org/wiki/Dice_notation)"
                }
            ]
        })
    }

    async run(message, args) {
        let regex = /^(\d+)?d(\d+)([+-]\d+)?$/;
        if (!regex.test(args["dice_notation"])) {
            message.reply("Unable to parse dice request. It needs to be in AdX+B notation!");
            return;
        }

        let parsed = args["dice_notation"].split(regex);
        let dice = parsed[1];
        let faces = parsed[2];
        let modifier = parsed[3];
        
        let results = [];
        if (dice === undefined) dice = 1;
        for (let i = 0; i < dice; i++) {
            results.push(RollCommand.getRandomInt(1, faces));
        }
        let finalSum = results.reduce((total, value) => total + value);
        if (modifier !== undefined) finalSum += parseInt(modifier);

        let reply = `Rolled ${args["dice_notation"]} dice and got ${finalSum}\n`;
        reply += `Individual dice rolled: [${results}]`;
        message.reply(reply);
    }

    /*
        Random integer between two inclusive integers
        From MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    */
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}