/*
    Random integer between two inclusive integers
    From MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*/
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'roll',
    description: 'Rolls dice in standard AdX+B dice notation',
    usage: '(A)dX(±B)',
    execute(message, args) {
        let regex = /^(\d+)?d(\d+)([+-]\d+)?$/;
        if (!regex.test(args[0])) {
            message.reply("Unable to parse dice request. It needs to be in AdX+B notation!");
            return;
        }

        let parsed = args[0].split(regex);
        let dice = parsed[1];
        let faces = parsed[2];
        let modifier = parsed[3];
        
        let results = [];
        if (dice === undefined) dice = 1;
        for (let i = 0; i < dice; i++) {
            results.push(getRandomInt(1, faces));
        }
        let finalSum = results.reduce((total, value) => total + value);
        if (modifier !== undefined) finalSum += parseInt(modifier);

        let reply = `Rolled ${args[0]} dice and got ${finalSum}\n`;
        reply += `Individual dice rolled: [${results}]`;
        message.reply(reply);
    }
};