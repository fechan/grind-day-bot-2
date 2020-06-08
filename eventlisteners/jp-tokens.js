const Discord = require('discord.js');
const config = require('../config.json');
const TinySegmenter = require('tiny-segmenter');
const fetch = require('node-fetch');
const URL = require('url').URL;

const API_ENDPOINT = 'https://jisho.org/api/v1/search/words?keyword=';

async function unpackResponses(responses) {
    let definitions = [];
    for (let response of responses) {
        let data = await response.json();
        data = data['data'][0];
        let word = {
            lemma: data['slug'],
            reading: data['japanese'][0]['reading'],
            meaning: data['senses'][0]['english_definitions']
        };
        definitions.push(word);
    }
    return definitions;
}

function createEmbed(definitions) {
    let text = "";
    for (let word of definitions) {
        let meaning = word.meaning.join('; ');
        text += `[${word.lemma}](https://jisho.org/word/${word.lemma}) (${word.reading}): ${meaning}\n`;
    }
    return new Discord.MessageEmbed().setDescription(text);
}

module.exports = {
    name: 'starboard',
    event: 'messageReactionAdd',
    callback: getDefinitions,
};

/*
    Gets and prints definitions for tokens the target message
    This assumes the target message is in Japanese
*/
function getDefinitions(messageReaction, user) {
    let message = messageReaction.message;
    let emoji = messageReaction.emoji.name;
    
    if (emoji === config.jpTokensEmoji) {
        let tokenizer = new TinySegmenter();
        let tokens = tokenizer.segment(message.content);
        tokens = [...new Set(tokens)]; // removes duplicates from array
        let requests = [];
        for (let token of tokens) {
            if (!config.jpTokensExclude.includes(token)) {
                requests.push(fetch(new URL(API_ENDPOINT + token)));
            }
        }
        Promise.all(requests)
            .then(unpackResponses)
            .then(createEmbed)
            .then(definitions => message.channel.send("", {embed: definitions}))
            .catch(reason => message.channel.send("Unable to fetch word definitions!"));
    }
}