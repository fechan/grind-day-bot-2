const Commando = require('discord.js-commando')

module.exports = class StaticSettingProvider extends Commando.SettingProvider {
    /**
     * Construct a static SettingProvider that always returns the settings in botConfig
     * @param {Object} botConfig Object with the config for a certain bot
     */
    constructor(botConfig) {
        super();
        this.config = botConfig;
    }

    async clear() {}
    async destroy() {}
    async init(client) {}

    async remove(guild, key) {
        throw "StaticSettingProvider doesn't support per-guild settings.";
    }

    async set(guild, key, val) {
        throw "StaticSettingProvider doesn't support per-guild settings.";
    }

    async getGuildID(guild) { 
        return "global";
    }

    get(guild, key, defVal) {
        if (key in this.config) {
            return this.config[key];
        }
        return defVal;
    }

}