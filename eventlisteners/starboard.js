const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'starboard',
    event: 'messageReactionAdd',
    callback: registerStar,
};

let starred = {}; //keys: message IDs, values: starboard entry's Message

/*
    Returns the first channel in a guild with name defined in config.starboardName
    If there isn't one, returns undefined
*/
function getStarboard(guild) {
    return guild.channels.cache.find(channel => channel.name === config.starboardName);
}

/*
    Processes a potential star
*/
function registerStar(messageReaction, user) {
    let message = messageReaction.message;
    let starboard = getStarboard(message.guild);
    let emoji = messageReaction.emoji.name;
    
    if (starboard && emoji === config.starboardEmoji) {
        let reactTime = new Date();
        if (message.author.id === user.id && !config.starboardCanStarOwnMessage) {
            user.send(`You can't ${emoji} your own message!`);
            messageReaction.users.remove(user);
        } else if (message.id in starred) { //if message already posted to starboard
            let starboardEntry = starred[message.id];
            starboardEntry.edit(`${emoji} **${messageReaction.count}** ${message.channel} ID: ${message.id}`);
        } else if (messageReaction.count === config.starboardThreshold &&
            reactTime - message.createdAt <= config.starboardTimeoutMs &&
            message.channel !== starboard) { //don't track messages inside the starboard
            let starboardEmbed = new Discord.MessageEmbed()
                .setAuthor(message.member.displayName, message.author.avatarURL())
                .setDescription(message.content)
                .addField("Original", `[Jump!](${message.url})`)
                .setFooter(message.createdAt.toUTCString());
            //add an image if the original had one
            let image = message.attachments.first();
            if (image !== undefined) {
                starboardEmbed.setImage(image.url)
            }
            starboard.send(`${emoji} ${message.channel} ID: ${message.id}`, {embed: starboardEmbed})
                .then(starboardEntry => starred[message.id] = starboardEntry);
        }
    }
}