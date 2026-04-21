const Event = require("../structure/event.js");
const Data = require("../data/data.js");
const developmentConfig = require("../data/development.json");

const { PermissionFlagsBits } = require("discord.js");

module.exports = new Event("messageCreate", "MEDIA_CHANNEL", async (client, message) => {
        if (message.author.id === client.user.id) {
            return;
        }
    
        if (!Data.mediaChannelList.includes(message.channel.id)) {
            return;
        }

        // why not .contains()?
        if (message.attachments.size < 1
        && !message.content.startsWith("https://youtube.com")      && !message.content.endsWith("https://youtube.com")
        && !message.content.startsWith("https://youtu.be")         && !message.content.endsWith("https://youtu.be")
        && !message.content.startsWith("https://www.youtu.be")     && !message.content.endsWith("https://www.youtube.com")
        && !message.content.startsWith("https://www.youtube.com")  && !message.content.endsWith("https://www.youtu.be")
        && !message.content.startsWith("https://tiktok.com")       && !message.content.endsWith("https://tiktok.com")
        && !message.content.startsWith("https://www.tiktok.com")   && !message.content.startsWith("https://www.tiktok.com")
        && !developmentConfig.superusers.includes(message.author.id) && !message.member.permissions.has(PermissionFlagsBits.ManageChannels)
    ){

        message.delete() && message.author.send("Please send a submission with an attachment or a YouTube/TikTok URL!");

    } else {
        message.react("👍");
        message.react("👎");
    }
});