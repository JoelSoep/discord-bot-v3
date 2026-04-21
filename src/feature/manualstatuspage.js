const Discord = require("discord.js");
const Data = require("../data/data.js");
const fs = require("fs");
const Client = require("../structure/client.js");
const config = require("../data/config.json");
const statusPage = require("../util/statuspage.js");
const api = new statusPage(config.atlassian_api_key, config.atlassian_page_id);
class ManualStatusPage {

    /**
     * 
     * @param {Client} client 
     * @param {Number} interval 
     */
    constructor(client, interval) {
        this.client = client;
        this.interval = interval;
        /** @type {string} */ 
        this.overrideDescription = "EMPTY";
        this.color = this.client.Color;
        this.channelState = "none"; // minor, major, critical, maintenance, none
        this.status = "OPERATIONAL"; // OPERATIONAL, DEGRADED_PERFORMANCE, PARTIAL_OUTAGE, MAJOR_OUTAGE, UNDER_MAINTENANCE

        this.playerCount = 0;
        /** @type {EmbedBuilder} */ this.embed = new Discord.EmbedBuilder();
        setInterval(() => this.sendEmbed(), 15000)
    }

    async getIncidents() {
        return Data.statusPageIncidentList;
    }

    async getEmbed() {
        const data = await this.getSummary();
        if (!data) {
            return;
        }
        // console.log(data.incidents[0]?.components);
        //data.incidents.forEach(incident => console.log(incident.incident_updates))
        this.channelState = data.status.indicator;
        const embed = new Discord.EmbedBuilder();
        embed.setTitle(this.getTitlePrefix(data.status.indicator) + data.status.description);
        embed.setColor(this.getColor(data.status.indicator));
        embed.setTimestamp(Date.now());
        embed.setDescription(this.overrideDescription);
        embed.setThumbnail("https://dunb17ur4ymx4.cloudfront.net/webstore/logos/ca037a9d9b6f4fbca8ffb6d74a96bc9ede993223.png")
        if (data.incidents.length == 0 && this.overrideDescription == "EMPTY") {
            embed.setDescription("Everything seems to be working fine!\nVisit play.mcmanhunt.com to join!") // DEFAULT DESCRIPTION
            // other fun info
        } else {
            let idArray = [];
            let i = 0;
            if (this.overrideDescription == "EMPTY") {
            embed.setDescription("We are actively working on the following item(s):")
            }
            data.incidents.forEach(incident => {
                let status = incident.status;
                incident.incident_updates.forEach(update => {
                    if (idArray.includes(update.id)) {
                        return;
                    }
                    idArray.push(update.id);
                    if (update.status == status && update.body != null) {
                        
                        embed.addFields({ name: incident.name + " (" + incident.status.charAt(0).toUpperCase() + incident.status.slice(1) + ")", value: update.body, inline: true });
                    }
                    i++;
                })
            });
        }
        return embed;
        
    }

    async sendEmbed() {
        this.getEmbed().then(embed => {
            Data.manualStatusPageChannelList.forEach(async (/**@type {string[]} */ channelArray, guildId) => {
                for (const channelId of channelArray) {
                    let channel = this.client.guilds.cache.get(guildId)?.channels.cache.get(channelId);
                    
                    if (!channel?.isTextBased()) {
                        continue;
                    }
                    
                    //if (channel.name !== this.getChannelName(this.channelState)) {
                        try {
                            channel.setName(this.getChannelName(this.channelState));
                        } catch { console.log(`No permission to edit channel name @sendEmbed ${guildId} | ${channel.id}`); }
                    //}

                    let messageId = Data.manualStatusPageMessagesList.get(channel.id);
                    let message = null;
                    if (messageId) {
                        try {
                            message = await channel.messages.fetch(messageId);
                        } catch {}
                    }
                    
                    if (message == null) {
                        const newMessage = await channel.send({ embeds: [embed] });
                        Data.manualStatusPageMessagesList.set(channel.id, newMessage.id);
                        this.saveData(Object.fromEntries(Data.manualStatusPageMessagesList));
                        continue;
                    }
                    
                    try {
                        await message.edit({ embeds: [embed] });
                    } catch {
                        const newMessage = await channel.send({ embeds: [embed] });
                        Data.manualStatusPageMessagesList.set(channel.id, newMessage.id);
                        this.saveData(Object.fromEntries(Data.manualStatusPageMessagesList));
                    }
                }
            })
        })
    }

    async getSummary() {
        const res = await api.getSummary();
        return res.data;
    }

    saveData(data) {
        fs.writeFileSync("./cache/cached_manualstatuspage_messages.json", JSON.stringify(data, null, 2));
    }

    getColor(status) {
        switch (status) {
            case 'DEGRADED_PERFORMANCE': case 'minor': return this.color.warning;
            case 'PARTIAL_OUTAGE': case 'major': return this.color.partial_danger;
            case 'MAJOR_OUTAGE': case 'critical': return this.color.danger;
            case 'UNDER_MAINTENANCE': case 'maintenance': return this.color.maintenance;
            default: return this.color.success;
        }
    }

    getTitlePrefix(status) {
        switch(status) {
            case 'minor': return ':yellow_circle: ';
            case 'major': return ':orange_circle: ';
            case 'critical': return '🔴 ';
            case 'maintenance': return ':tools: ';
            default: return ':white_check_mark: ';
        }
    }

    getChannelName(status) {
        switch(status) {
            case 'minor': return '🟡┃status';
            case 'major': return '🟠┃status';
            case 'critical': return '🔴┃status';
            case 'maintenance': return '🛠️┃status';
            default: return '✅┃status';
        }
    }


}

module.exports = ManualStatusPage;