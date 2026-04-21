const schema = require("../schema/hetzneruser.js");
const cachedData = require("../data/data.js");
const Client = require("../structure/client.js");
const Cloud = require("hetzner-cloud-api");

class HetznerInitializer {
    
    /**
     * @param {Client} client 
     */

    constructor(client) {
        this.client = client;
        this.init().then(() => { 
            this.getServers();
            setInterval(this.getServers, 300000);
        });
    }

    async init() {
        console.log("Caching Hetzner accounts...");
            (await schema.find()).forEach(data => {
                let list = cachedData.hetznerAuthList.get(data.UserId);
                if (list == null) {
                    cachedData.hetznerAuthList.set(data.UserId, new Map().set(data.Organization, data.API_Key));
                } else {
                cachedData.hetznerAuthList.set(data.UserId, list.set(data.Organization, data.API_Key));
                }
            })
        console.log(this.client.Color.green + "Cached all Hetzner accounts from database." + this.client.Color.white);
    }

    async getServers() {
        const data = await schema.find();
        for (const item of data) {
            let list = cachedData.hetznerServerList.get(item.UserId);
            const hetzner = new Cloud(item.API_Key);
            const res = await hetzner.getServers();
            cachedData.hetznerServerList.set(item.UserId, (list ?? new Map()).set(item.Organization, res));
        }
    }
    
}

module.exports = HetznerInitializer