const Event = require("../structure/event.js");
module.exports = new Event("guildMemberAdd", "MEMBER_JOIN", async (client, member) => {

    if (member == null) {
        return;
    }

    // whatever
})