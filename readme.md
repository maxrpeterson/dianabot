# Dianabot
A slackbot for queueing students for help during TA hours, using the [slackbot NPM](https://github.com/rmcdaniel/node-slackbot) by [Richard McDaniel](https://github.com/rmcdaniel)

-----
# how to run

1. First, if you haven't created a bot user integration, create one [here](https://my.slack.com/services/new/bot) and invite the bot to whatever slack group you would like it to function in.
2. Then, create an environmental variable `SLACK_BOT_KEY` that points to the key of the bot generated.
3. Run `node app.js`, then just mention the bot with commands in any slack group it's a part of.
4. In order to use commands like `next` and `clear queue`, you need to add your slack user ID as an environmental variable.
	1. Once the bot is running and in a channel, mention the bot without any commands.
	2. This will log the message to your terminal, giving you the user ID of whoever sent the message.
	3. Copy your user ID and save this to an environmental variable `SLACK_USER_ID`
	4. Restart the bot and you will now be able to use the TA commands.

-------

### List of commands:
All commands work by mentioning the bot directly, using the `@` mention system of Slack. For instance, to use the queue command, you would write: `@bot-name q me`
- `queue me` or `q me` - add yourself to the queue for help
- `remove me` - remove yourself from the queue
- `status` - display the current status of/who is in the queue
- `help` - displays a list of the commands available to anyone who is not the admin/TA

Commands only available for the admin/TA:
- `next` - removes the first person from the queue and sends a message to alert them that it is their turn. It also displays the new status of the queue
- `clear queue` - clears the queue without alerting anyone

Also some easter eggs that may or may not be useful

For more info on bots/bot users, check out [this page](https://api.slack.com/bot-users).