var request = require("request");
var xml2js = require('xml2js');

var xmlParser = new xml2js.Parser();

module.exports = function(bot, taID) {
	// write your easter egg message handler function in here
	// then include it in the `return` statement below

	// IMPORTANT: always include a parameter for a callback function
	// and make sure to call the callback function at the end of your message handler
	// parameters for all message handlers should be `message` and `callback`

	// `validate` is simply a helper to make sure the message is meant for the bot
	function validate(message) {
		return message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1;
	}

	// paramify is useful if wording of the message is important
	// returns the message in an array of words without the mention at the beginning
	function paramify(message) {
		var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
		var command = commandString.split(" ");
		if (command[0] === "") {command.shift();}
		return command;
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
			var command = paramify(message);
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
							botMessage = Math.random() < 0.5 ? `Nope, the ${trainLineQuery} is fine` : `Nah, the ${trainLineQuery} is fine`;
						} else {
							botMessage = `Yep, the ${trainLineQuery} is totally fucked`;
						}
						bot.sendMessage(message.channel, botMessage);
					});
				});
			}
		}
		cb(null, 'trainStatus');
	};

  var floorMessage = function(message, cb) {
    if (validate(message)) {
      var command = paramify(message);
      if ((command[0] === "I" || command[0] === "i") && command[1] === "am" && command[2] === "on" && command[3] === "the" && command[5] === "floor") {
        var floorNumber = command[4];
        var botMessage =  "The TAs are on the " + floorNumber + " floor today";
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'floorMessage');
  }

  var favoriteThings = function(message, cb) {
    if (validate(message)) {
      let favoriteArray = ["And video games, that new Zelda is dope!", "And Dippin' Dots, the ice cream of astronauts!", "And algorithms, I'm a genius in case you didn't know!", "And eqaulity, our similarities are more powerful than our differences!", "And black and white cookies, the embodiment of racial harmony in cookie form. Look to the cookie!"]
      var command = paramify(message);
      if ((command[0] === "What" || command[0] === "what") && command[1] === "is" && command[2] === "your" && command[3] === "favorite" && command[4] === "thing?") {
        var botMessage =  "Seeing the students faces in their profile pictures! ..." + favoriteArray[Math.floor(Math.random() * favoriteArray.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'favoriteThings');
  }

  var doYouLike = function(message, cb) {
    if (validate(message)) {
      let answers = ["Kinda", "Of course!", "Eh", "Sometimes", "To be honest, not really", "Very much!", "You're the best!", "Oh yea! If you were a pen, you'd be FINE point", "You know it!", "If you were a contract, you'd be all FINE print", "Well, you're ok", "Depends... do YOU like ME?", "Like, more than a friend?", "Marry me!"]
      var command = paramify(message);
      if ((command[0] === "Do" || command[0] === "do") && command[1] === "you" && command[2] === "like" && command[3] === "me?") {
        var botMessage =  answers[Math.floor(Math.random() * answers.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'doYouLike');
  }

  var thanks = function(message, cb) {
    if (validate(message)) {
      //could randomize emojis here
      var command = paramify(message);
      if (command[0] === "Thanks!" || command[0] === "thanks!") {
        var botMessage =  "You're very welcome :panda:";
      } else if ((command[0] === "Thank" || command[0] === "thank") && command[1] === "you") {
        var botMessage =  "You're very welcome :bluesteel:";
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'thanks');
  }

	return {
		kyleSmile: kyleSmile,
		trainStatus: trainStatus,
    floorMessage: floorMessage,
    favoriteThings: favoriteThings,
    doYouLike: doYouLike,
    thanks: thanks
	};

}; // module.exports
