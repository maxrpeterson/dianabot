var request = require("request");
var slackbot = require("./slackbot-new");
var xml2js = require('xml2js');
var fs = require('fs');

var xmlParser = new xml2js.Parser();

var botKey = process.env.SLACK_BOT_KEY;

var bot = new slackbot(botKey);

var taID = process.env.SLACK_USER_ID;

var queue;

function backup(queueArray) {
	fs.writeFile('./db.json', JSON.stringify({queue: queueArray}));
}

try {
	queue = JSON.parse(fs.readFileSync('./db.json', 'utf8')).queue;
} catch(e) {
	queue = [];
	backup(queue);
}

var prettyQueue = function() {
	var queueArray = queue.map(function(user) {
		return user.real_name;
	});
	return "Current queue is now: " + (queueArray.length ? queueArray.join(", ") : "empty");
};

var dianabot = function(message, cb) {
	// the if/else if statements are for commands that don't rely
	// on the wording as much
	if (message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1) {
		if (message.text.indexOf("status") > -1) {
			bot.sendMessage(message.channel, prettyQueue());

		} else if (message.text.indexOf("queue me") > -1 || message.text.indexOf("q me") > -1) {
			// adding a user to the queue
			if (queue.filter(function(e) {return e.id === message.user}).length === 0) {
				bot.api("users.info", {user: message.user}, function(data) {
					queue.push(data.user);
					bot.sendMessage(message.channel, prettyQueue());
					backup(queue);
				});
			} else {
				bot.sendMessage(message.channel, "Already in queue. " + prettyQueue());
			}

		} else if (message.text.indexOf("remove me") > -1) {
			// removing a user
			var userToRemove = queue.filter(function(user) {return user.id === message.user});
			if (userToRemove.length) {
				queue.splice(queue.indexOf(userToRemove[0]), 1);
				bot.sendMessage(message.channel, ":wave: " + prettyQueue());
				backup(queue);
			}

		} else if (message.text.indexOf("next") > -1 && message.user === taID) {
			// next student
			var currentStudent = queue.shift();
			if (currentStudent) {
				bot.sendMessage(message.channel, "Up now: <@" + currentStudent.id + "> -- " + prettyQueue());
				backup(queue);
			}

		} else if (message.text.indexOf("help") > -1) {
			// help message
			bot.sendMessage(message.channel, "All commands work only when you specifically mention me. Type `queue me` or `q me` to queue yourself and `status` to check current queue. Type `remove me` to remove yourself.")

		} else if (message.text.indexOf("clear queue") > -1 && message.user === taID) {
			queue = [];
			bot.sendMessage(message.channel, "Queue cleared");
			backup(queue);

		} else if (message.text.indexOf(":kylesmile:") > -1) {
			request("http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en", function(err, response, body) {
				var text = body.replace(/\\'/g, "'");
				var quote = JSON.parse(text).quoteText;
				bot.sendMessage(message.channel, ":kylesmile: :kylesmile: As I always like to say: " + quote + " :kylesmile: :kylesmile:");
			});
		} else {
			// these are more wording-specific commands
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
						var botMessage = (lineQueried[0].status[0] === "GOOD SERVICE") ? "Nope" : "Yep";
						bot.sendMessage(message.channel, botMessage);
					});
				});
			} else {
				console.log(message);
			}
		}
	} else if(message.type === "hello") {
		console.log("dianabot connected...");
	}
};

bot.use(dianabot);

bot.connect();

