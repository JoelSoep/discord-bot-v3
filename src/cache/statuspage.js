const Statuspage = require('../util/statuspage.js');
const config = require("../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
const Client = require("../structure/client.js");
const Data = require("../data/data.js");
const autoSchema = require("../schema/autoStatusPage.js");
const manualSchema = require("../schema/manualStatusPage.js");
const fs = require("fs");
const Discord = require("discord.js");

class StatusPageCacher {

    /**
     * @param {Client} client
     */

    constructor (client) {
        this.client = client;

        this.cacheAutoStatusPage();
        this.cacheManualStatusPage();
        this.checkIncidents();
        this.checkComponents();
        this.checkMaintenances();
        this.loadManualDescriptionData();
        console.log(this.client.Color.green + "Booted Statuspage cacher!" + this.client.Color.white);
        setInterval(this.checkIncidents, 30000);
        setInterval(this.checkComponents, 30000);
        setInterval(this.checkMaintenances, 30000);
    }

    async checkIncidents () {
        try {
        page.getUnresolvedIncidents().then((data) => Data.statusPageIncidentList = data);
        } catch (err) {}
    }

    async checkComponents () {
        try {
            const data = await page.getComponents();
            Data.statusPageComponentList = data;
        } catch (err) {}
    }

    async checkMaintenances() {
        try {
            const data = await page.getActiveMaintenances();
            Data.statusPageMaintenanceList = data;
        } catch (err) {}
    }

    /**
     * autoStatusPage caching
     */

    async cacheAutoStatusPage() {
        console.log("Caching autoStatusPage channels...");
        const loaded = this.loadAutoData();
        Data.autoStatusPageMessagesList = new Discord.Collection(Object.entries(loaded));

        this.client.guilds.cache.forEach(guild => {
            autoSchema.findOne({ Guild: guild.id }, async (err, data) => {
                if (err) throw err;
    
                if (!data) {
                    return;
                }
    
                let channelArray = [];
                data.Channel.forEach(channel => {
                    channelArray.push(channel);
                });
                Data.autoStatusPageChannelList.set(guild.id, channelArray);
                console.log(this.client.Color.green + "Cached all autoStatusPage channels from database." + this.client.Color.white);
            })
        })
    }

    async cacheManualStatusPage() {
        console.log("Caching manualStatusPage channels...");
        const loaded = this.loadManualData();
        Data.manualStatusPageMessagesList = new Discord.Collection(Object.entries(loaded));

        this.client.guilds.cache.forEach(guild => {
            manualSchema.findOne({ Guild: guild.id }, async (err, data) => {
                if (err) throw err;
    
                if (!data) {
                    return;
                }
    
                let channelArray = [];
                data.Channel.forEach(channel => {
                    channelArray.push(channel);
                });
                Data.manualStatusPageChannelList.set(guild.id, channelArray);
                console.log(this.client.Color.green + "Cached all manualStatusPage channels from database." + this.client.Color.white);
            })
        })
    }
    
    loadAutoData() {
         if (!fs.existsSync("./cache/cached_autostatuspage_messages.json")) {
            return {}; 
        };
        return JSON.parse(fs.readFileSync("./cache/cached_autostatuspage_messages.json"))
    }

    loadManualData() {
        if (!fs.existsSync("./cache/cached_manualstatuspage_messages.json")) {
            return {}; 
        };
        return JSON.parse(fs.readFileSync("./cache/cached_manualstatuspage_messages.json"))
    }

    loadManualDescriptionData() {
        if (!fs.existsSync("./cache/cached_manualstatuspage_description.json")) {
            return {}; 
        };
        this.client.ManualStatusPage.overrideDescription = JSON.parse(fs.readFileSync("./cache/cached_manualstatuspage_description.json"))
    }

}

module.exports = StatusPageCacher

