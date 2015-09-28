# Dianabot
A slackbot for queueing students for help during TA hours, using the [slackbot NPM](https://github.com/rmcdaniel/node-slackbot) by [Richard McDaniel](https://github.com/rmcdaniel)

-----
# how to run

1. First, if you haven't created a bot user integration, create one [here](https://my.slack.com/services/new/bot) and invite the bot to whatever slack group you would like it to function in.
2. Then, create an environmental variable `SLACK_BOT_KEY` that points to the key of the bot generated.
3. Run `node app.js`, then just mention the bot with commands in any slack group it's a part of.

For more info, check out [this page](https://api.slack.com/bot-users).