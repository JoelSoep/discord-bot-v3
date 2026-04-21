const schema = require("../schema/pterodactyluser.js");
const cachedData = require("../data/data.js");
const Client = require("../structure/client.js");
const Nodeactyl = require("nodeactyl");
const config = require("../data/config.json");

class PterodactylInitializer {
    
    /**
     * @param {Client} client 
     */

    constructor(client) {
        this.client = client;
        this.init();
        this.getServers();
        setInterval(this.getServers, 180000);
    }

    async init() {
        console.log("Caching Pterodactyl accounts...");
            (await schema.find()).forEach(data => {
                cachedData.pterodactylAuthList.set(data.UserId, data.API_Key);
            })
        console.log(this.client.Color.green + "Cached all Pterodactyl accounts from database." + this.client.Color.white);
    }


    async getServers() {
        const application = new Nodeactyl.NodeactylApplication(config.ptero_host, config.ptero_api_key);
        return cachedData.pterodactylServerList = await application.getAllServers().catch(err => console.log(err));
    }
}

module.exports = PterodactylInitializer;