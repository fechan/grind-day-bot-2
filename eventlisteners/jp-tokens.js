const Discord = require('discord.js');
const TinySegmenter = require('tiny-segmenter');
const fetch = require('node-fetch');
const URL = require('url').URL;

const API_ENDPOINT = 'https://jisho.org/api/v1/search/words?keyword=';

module.exports = class JPTokensListener {
    static listener = true;
    static name = "jp-tokens";
    static event = "messageReactionAdd";

    constructor(config) {
        this.jpTokensEmoji = config.jpTokensEmoji;
        this.jpTokensExclude = config.jpTokensExclude;
    }

    /*
        Gets and prints definitions for tokens the target message
        This assumes the target message is in Japanese
    */
    async callback(messageReaction, user) {
        if (messageReaction.partial) {
            try {
                await messageReaction.fetch();
            } catch {
                console.error(`User ${user.username}#${user.discriminator} (ID ${user.id}) attempted to tokenize Japanese but the following error occurred: ${error}`);
                return;
            }
        }
        let message = messageReaction.message;
        let emoji = messageReaction.emoji.name;
        
        if (emoji === this.jpTokensEmoji) {
            let tokenizer = new TinySegmenter();
            let tokens = tokenizer.segment(message.content);
            tokens = [...new Set(tokens)]; // removes duplicates from array
            let requests = [];
            for (let token of tokens) {
                if (!this.jpTokensExclude.includes(token)) {
                    requests.push(fetch(new URL(API_ENDPOINT + token)));
                }
            }
            Promise.all(requests)
                .then(JPTokensListener.unpackResponses)
                .then(JPTokensListener.createEmbed)
                .then(definitions => message.channel.send("", {embed: definitions}))
                .catch(reason => message.channel.send("Unable to fetch word definitions!"));
        }
    }

    static async unpackResponses(responses) {
        let definitions = [];
        for (let response of responses) {
            let data = await response.json();
            if (data.data.length > 0) { // only include words with definitions
                data = data['data'][0];
                let word = {
                    lemma: data['slug'],
                    reading: data['japanese'][0]['reading'],
                    meaning: data['senses'][0]['english_definitions']
                };
                definitions.push(word);
            }
        }
        return definitions;
    }
    
    static createEmbed(definitions) {
        let text = "";
        for (let word of definitions) {
            let meaning = word.meaning.join('; ');
            text += `[${word.lemma}](https://jisho.org/word/${word.lemma}) (${word.reading}): ${meaning}\n`;
        }
        return new Discord.MessageEmbed().setDescription(text);
    }
}