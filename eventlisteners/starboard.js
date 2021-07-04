const Discord = require('discord.js');

module.exports = class StarboardListener {
    static listener = true;
    static name = "starboard";
    static event = "messageReactionAdd";

    constructor(config) {
        this.starboardName = config.starboardName;
        this.starboardEmoji = config.starboardEmoji;
        this.starboardCanStarOwnMessage = config.starboardCanStarOwnMessage;
        this.starboardTimeoutMs = config.starboardTimeoutMs;
        this.starboardThreshold = config.starboardThreshold;
        this.configName = config.configName;

        this.starred = {} //keys: message IDs, values: starboard entry's Message
    }

    /*
        Returns the first channel in a guild with name defined in config.starboardName
        If there isn't one, returns undefined
    */
    getStarboard(guild) {
        return guild.channels.cache.find(channel => channel.name === this.starboardName);
    }
    
    /*
        Processes a potential star
    */
    callback(messageReaction, user) {
        let message = messageReaction.message;
        let starboard = this.getStarboard(message.guild);
        let emoji = messageReaction.emoji.name;
        
        if (starboard && emoji === this.starboardEmoji) {
            let reactTime = new Date();
            if (message.author.id === user.id && !this.starboardCanStarOwnMessage) {
                user.send(`You can't ${emoji} your own message!`);
                messageReaction.users.remove(user);
            } else if (reactTime - message.createdAt >= this.starboardTimeoutMs) {
                let response = `Too much time has passed since the message was posted to ${emoji} this message! ` +
                    `Your ${emoji} will remain but the message will not be added to ${starboard}.`;
                user.send(response);
            } else if (message.id in this.starred) { //if message already posted to starboard
                let starboardEntry = this.starred[message.id];
                starboardEntry.edit(
                    `${emoji} **${messageReaction.count}** ${message.channel} ID: ${message.id}`,
                    starboardEntry.embeds[0]);
            } else if (messageReaction.count === this.starboardThreshold &&
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
                    .then(starboardEntry => this.starred[message.id] = starboardEntry);
            }
        }
    }
}