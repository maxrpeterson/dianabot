var fs = require('fs');

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
  console.log("prettyQueue firing:", queue)
  var queueArray = queue.map(function(user) {
    return user.profile.real_name;
  });
  return "Current queue is now: " + (queueArray.length ? queueArray.join(", ") : "empty");
};
module.exports = function(bot, taIDs) {

  var gracehopper = function(message, cb) {
    // the if/else if statements are for commands that don't rely
    // on the wording as much

    //console.log(message)

    if (message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1) {
      // State Message checks
      var statusMessage     = message.text.indexOf("status") > -1,
          queueMeMessage    = message.text.indexOf("queue me") > -1 || message.text.indexOf("q me") > -1,
          removeMeMessage   = message.text.indexOf("remove me") > -1,
          nextMessage       = message.text.indexOf("next") > -1 && taIDs.includes(message.user),
          helpMessage       = message.text.indexOf("help") > -1,
          clearQueueMessage = message.text.indexOf("clear queue") > -1 && taIDs.includes(message.user),
          easterEggs        = message.text.indexOf("easter eggs") > -1;

      if (statusMessage) {
        bot.sendMessage(message.channel, prettyQueue());

      } else if (queueMeMessage) {
        // adding a user to the queue
        if (queue.filter(function(e) {return e.id === message.user}).length === 0) {
          bot.api("users.info", {user: message.user}, function(data) {
            console.log("queueMeMessage firing: ", data.user)
            queue.push(data.user);
            bot.sendMessage(message.channel, prettyQueue());
            backup(queue);
          });
        } else {
          bot.sendMessage(message.channel, "Already in queue. " + prettyQueue());
        }

      } else if (removeMeMessage) {
        // removing a user
        var userToRemove = queue.filter(function(user) {return user.id === message.user});
        if (userToRemove.length) {
          queue.splice(queue.indexOf(userToRemove[0]), 1);
          bot.sendMessage(message.channel, ":wave: " + prettyQueue());
          backup(queue);
        }

      } else if (nextMessage) {
        // next student
        var currentStudent = queue.shift();
        if (currentStudent) {
          bot.api("users.info", {user: message.user}, function(data) {
          console.log("message", message);
          console.log("nextMessage firing: ", data);
          console.log("current Student: ", currentStudent);
            var currentTA = data.user;
            console.log("currentTA: ", currentTA)
            bot.sendMessage(message.channel, "Up now with " + currentTA.profile.real_name + ": <@" + currentStudent.id + "> -- " + prettyQueue());
            backup(queue);
          });
        }

      } else if (easterEggs) {
        bot.sendMessage(message.channel, "Tag me and try these commands: `Do you like me?`, `What is your favorite thing?`, `is the (train line) fucked?`. And if you dig what I'm saying, just say `Thanks!` :smile:")
      } else if (helpMessage) {
        // help message
        bot.sendMessage(message.channel, "All commands work only when you specifically mention me. Type `queue me` or `q me` to queue yourself and `status` to check current queue. Type `remove me` to remove yourself.")

      } else if (clearQueueMessage) {
        queue = [];
        bot.sendMessage(message.channel, "Queue cleared");
        backup(queue);
      }

    } else if(message.type === "hello") {
      console.log("grace hopper connected...");
    }
    cb(null, 'core-bot');
  };
  return gracehopper;
};
