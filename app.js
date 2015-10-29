var request = require('request');
var slackbot = require('./slackbot-new');
var xml2js = require('xml2js');
var fs = require('fs');

var xmlParser = new xml2js.Parser();

var botKey = process.env.SLACK_BOT_KEY;
var taID = process.env.SLACK_USER_ID;

var bot = new slackbot(botKey);

var dianabot = require('./core-bot-functions')(bot, taID);
var easterEggs = require('./easter-eggs')(bot, taID);

bot.use(dianabot);

for (var key in easterEggs) {
	bot.use(easterEggs[key]);
}

bot.connect();

