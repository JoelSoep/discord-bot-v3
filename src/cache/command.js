const schema = require("../schema/command.js");
const Data = require("../data/data.js");
const Client = require("../structure/client.js");

class CommandNameInitializer {

    /**
     * @param {Client} client 
     */

    constructor(client) {
        this.client = client;
        this.init();
    }

    async init() {
        console.log("Caching disabled command names...");
        this.client.guilds.cache.forEach(guild => {
            schema.findOne({ Guild: guild.id }, async (err, data) => {
                if (err) throw err;

                if (!data) {
                    return;
                }

                data.Channel.forEach(channel => {
                    Data.commandNameList.push(channel);
                })
                console.log(this.client.Color.green + "Cached all disabled command names from database." + this.client.Color.white);
            })
        })
    }
}

module.exports = CommandNameInitializer;