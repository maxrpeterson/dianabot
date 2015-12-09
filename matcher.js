function validate(message) {
	return message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1;
}

function paramify(message) {
	var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
	var command = commandString.split(" ");
	if (command[0] === "") {command.shift();}
	return command;
}

function Matcher(args) {
	if (!this instanceof Matcher) {
		return new Matcher(args);
	}

	this.command = args.command;
	this.exactMatch = args.exactMatch || false;
	this.response = args.response;
}

Matcher.prototype.respond = function(message) {
	if (validate(message) && message.text.indexOf(this.command) > -1) {
		args.response();
	};
}

function Distro(message) {
	var i = 0,
			max = this.listeners.length;
	for (; i < max; i++) {
		this.listeners[i].respond(message);
	}
}

Distro.listeners = [];

Distro.addResponse = function(args) {
	this.listeners.push(new Matcher())
};
