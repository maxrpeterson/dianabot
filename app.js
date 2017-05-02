var request = require('request');
var slackbot = require('./slackbot-new');
var fs = require('fs');

var botKey = "xoxb-159703536768-pd7LMDEykTZER5m5PN6bh7gD";
var taIDs = "U361Q3GPP,U2JU26MPS,U42S89JCX".split(",");

var bot = new slackbot(botKey);

var gracehopper = require('./core-bot-functions')(bot, taIDs);
var easterEggs = require('./easter-eggs')(bot, taIDs);

bot.use(gracehopper);

for (var key in easterEggs) {
	bot.use(easterEggs[key]);
}

bot.connect();

