var request = require("request");
var xml2js = require('xml2js');

var xmlParser = new xml2js.Parser();

module.exports = function(bot, taID) {

	function validate(message) {
		return message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1;
	}

	var kyleSmile = function(message, cb) {
		if (validate(message) && message.text.indexOf(':kylesmile:') > -1) {
			request("http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en", function(err, response, body) {
				var text = body.replace(/\\'/g, "'");
				var quote = JSON.parse(text).quoteText;
				bot.sendMessage(message.channel, ":kylesmile: :kylesmile: As I always like to say: " + quote + " :kylesmile: :kylesmile:");
			});
		}
		cb(null, 'kyleSmile');
	};

	var trainStatus = function(message, cb) {
		if (validate(message)) {
			var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
			var command = commandString.split(" ");
			if (command[0] === "") {command.shift();}
			if (command[0] === "is" && command[1] === "the" && command[3] === "train" && (command[4] === "fucked" || command[4] === "fucked?")) {
				var trainLineQuery = command[2];
				request("http://web.mta.info/status/serviceStatus.txt", function(err, response, body) {
					xmlParser.parseString(body, function(err, result) {
						var lines = result.service.subway[0].line;
						var lineQueried = lines.filter(function(line) {
							return line.name[0].toLowerCase().indexOf(trainLineQuery) > -1;
						});
						var botMessage;
						if (lineQueried[0].status[0] === 'GOOD SERVICE') { // ? "Nope" : "Yep";
							botMessage = Math.random() < 0.5 ? 'Nope' : 'Nah';
						} else {
							botMessage = 'Yep';
						}
						bot.sendMessage(message.channel, botMessage);
					});
				});
			}
		}
		cb(null, 'trainStatus');
	};

	return {
		kyleSmile: kyleSmile,
		trainStatus: trainStatus
	};

}; // module.exports