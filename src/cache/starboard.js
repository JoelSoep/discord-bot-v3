const schema = require("../schema/starboard.js");
const Data = require("../data/data.js");
const Client = require("../structure/client.js");

class StarboardInitializer {

    /**
     * @param {Client} client 
     */

    constructor(client) {
        this.client = client;
        this.init();
    }

    async init() {
        console.log("Caching starboards...");
        this.client.guilds.cache.forEach(guild => {
            schema.findOne({ Guild: guild.id }, async (err, data) => {
                if (err) throw err;

                if (!data) {
                    return;
                }

                data.Channel.forEach(channel => {
                    Data.starboardList.push(channel);
                })
                console.log(this.client.Color.green + "Cached all starboards from database." + this.client.Color.white);
            })
        })
    }
}

module.exports = StarboardInitializer;