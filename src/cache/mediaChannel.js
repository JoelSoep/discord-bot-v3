const schema = require("../schema/mediaChannel.js");
const Data = require("../data/data.js");
const Client = require("../structure/client.js");

class MediaChannelInitializer {

    /**
     * @param {Client} client 
     */

    constructor(client) {
        this.client = client;
        this.init();
    }

    async init() {
        console.log("Caching media channels...");
        this.client.guilds.cache.forEach(guild => {
            schema.findOne({ Guild: guild.id }, async (err, data) => {
                if (err) throw err;

                if (!data) {
                    return;
                }

                data.Channel.forEach(channel => {
                    Data.mediaChannelList.push(channel);
                })
                console.log(this.client.Color.green + "Cached all media channels from database." + this.client.Color.white);
            })
        })
    }
}

module.exports = MediaChannelInitializer;