const Event = require("../structure/event.js");
const Data = require("../data/data.js");

module.exports = new Event("messageCreate", "STARBOARD", async (client, message) => {
    if (message.author.id === client.user.id) {
        return;
    }

    if (!Data.starboardList.includes(message.channel.id)) {
        return;
    }

   message.react("⭐");
})