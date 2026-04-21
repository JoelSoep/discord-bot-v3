const Event = require("../structure/event.js");

module.exports = new Event("messageCreate", "MESSAGE_CREATE_COMMANDS", async (client, message) => {
        if (message.author.id === client.user.id) {
            return;
        }

        if (message.content.startsWith("!barn")) {
            message.channel.send("Ayo wrong command, learn how to spell");
        }

        if (message.content.startsWith("!ip")) {
            message.channel.send("**IP: play.mcmanhunt.com**");
        }
});