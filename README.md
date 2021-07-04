# Grind Day Bot 2

A Discord bot for use with my friends, who happen to like Star Trek and games of Civilization. It's called "Grind Day Bot" after "Grind Day," which is what we called the day before a test in one of my high school math classes. This is the second iteration of the bot; the first one was written with Discord.py while this one uses Discord.js.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You can use the Heroku deploy button to deploy directly to Heroku, but remember you **still need to provide the Discord API bot token** for it to work properly!

For the `findgames` command to work, you will need to enable "presence intent" and "server members intent" in the "bot" page of the application in the Discord Developer Portal. This is because the command relies on (1) being able to see members and (2) being able to see if they're online.

## Feature: Multibot
Newer versions of GDB2 are designed to run multiple bot users (with different bot tokens) at the same time, each with different configs. `config.json` should contain an array of bot config objects in the same format as the root object in `config.defaults.json`. Settings defined in `config.json` will override the defaults (and settings not defined there will just use the default values). **You should always override** `configName` and `ownerID`, and probably `enabledCommands` and `enabledListeners`.

## enabledCommands and enabledListeners
Each command in `/commands` and each listener in `/listeners` defines a `static name` field. In the bot config, you can put this name in `enabledCommands` or `enabledListeners` to allow a bot to use a command or listener respectively.

Only the `help` and `unknownCommand` commands provided by default by the Commando library are enabled in `config.defaults.json`, but you can re-enable them using their command name (e.g. `eval` can be re-enabledby including `eval` in `enabledCommands`).