const Client = require("../structure/client.js");
const Data = require ("../data/data.js");
const { AttachmentBuilder, ActivityType } = require("discord.js");
const MCStatusAPI = require("../util/mcstatus.js");
const api = new MCStatusAPI();
const fs = require("fs");
const config = require("../data/config.json");

class AutoStatusPage {

    /**
    * @param {Client} client
    */

    constructor (client, interval) {
        this.client = client;
        this.interval = interval;
        this.offlineCount = 0; 
        this.maxOfflineCount = 5;

        this.updateWidget();
        this.updateOnlineStatus();
        setInterval(() => this.updateWidget(), this.interval);
        setInterval(() => this.updateOnlineStatus(), this.interval);
    }

    async updateWidget() {
        let description = `
        This widget displays the reachability of play.mcmanhunt.com.
Repeated failing of a ping indicates that the servers are unreachable for the audience.
If the server is unreachable for more than ${this.interval / 60000 * this.maxOfflineCount} minutes, a message will appear in this channel.
Last update: <t:${Math.floor(Date.now() / 1000)}:R>`;

        let attachment = new AttachmentBuilder(api.getJavaWidget(), { name: "status.png" });
        Data.autoStatusPageChannelList.forEach(async (/**@type {string[]} */ channelArray, guildId) => {
            for (const channelId of channelArray) {
                let channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelId);

                if (!channel?.isTextBased()) {
                    continue;
                }

                let messageId = Data.autoStatusPageMessagesList.get(channel.id);
                let message = null;
                if (messageId) {
                    try {
                        message = await channel.messages.fetch(messageId);
                    } catch {}
                }

                if (message == null) {
                    const newMessage = await channel.send({ content: description, files: [attachment] });
                    Data.autoStatusPageMessagesList.set(channel.id, newMessage.id);
                    this.saveData(Object.fromEntries(Data.autoStatusPageMessagesList));
                    continue;
                }

                try {
                    await message.edit({ content: description, files: [attachment] });
                } catch {
                    const newMessage = await channel.send({ content: description, files: [attachment] });
                    Data.autoStatusPageMessagesList.set(channel.id, newMessage.id);
                    this.saveData(Object.fromEntries(Data.autoStatusPageMessagesList));
                }
            }
        });
    }

    async updateOnlineStatus() {
        const data = await api.getJavaStatus();
        const online = data?.online ?? false;
        if (!online) {
            this.offlineCount++;
        } else {
            this.offlineCount = 0;
        }

        this.client.user.setPresence({
            activities: [
                { name: "play.mcmanhunt.com", type: ActivityType.Playing, url: "https://mcmanhunt.com" },
                { name: `${data?.players?.online ?? 0} online`}
            ],
            status: "online"
       })

       this.client.ManualStatusPage.playerCount = data?.players?.online ?? 0;
        if (this.offlineCount != this.maxOfflineCount) {
            return;
        }

        Data.autoStatusPageChannelList.forEach(async (/**@type {string[]} */ channelArray, guildId) => {
            for (const channelId of channelArray) {
                let channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelId);
                if (!channel?.isTextBased()) {
                     continue;
                }

                channel.send(`<@&${config.statuspage_notification_role_id}> The pingservice has not received a response from play.mcmanhunt.com for more than ${this.interval / 60000 * this.maxOfflineCount} minutes.\nConsider performing a manual check, and update the server status with \`statuspage\` if needed.\nPlease delete this message once seen.`)
             }
        });
    
    }

    saveData(data) {
        fs.writeFileSync("./cache/cached_autostatuspage_messages.json", JSON.stringify(data, null, 2));
    }
}

module.exports = AutoStatusPage;