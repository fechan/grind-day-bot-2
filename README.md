# Grind Day Bot 2

A Discord bot for use with my friends, who happen to like Star Trek and games of Civilization. It's called "Grind Day Bot" after "Grind Day," which is what we called the day before a test in one of my high school math classes. This is the second iteration of the bot; the first one was written with Discord.py while this one uses Discord.js.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You can use the Heroku deploy button to deploy directly to Heroku, but remember you **still need to provide the Discord API bot token** for it to work properly!

For the `findgames` command to work, you will need to enable "presence intent" and "server members intent" in the "bot" page of the application in the Discord Developer Portal. This is because the command relies on (1) being able to see members and (2) being able to see if they're online.
