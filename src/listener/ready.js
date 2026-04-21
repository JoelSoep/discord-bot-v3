const dns = require("node:dns/promises");
const Event = require("../structure/event.js");
const mongoose = require("mongoose");
const config = require("../data/config.json");
const Color = require("../util/color.js");
const StarboardInitializer = require("../cache/starboard.js");
const PterodactylInitializer = require("../cache/pterodactyl.js");
const StatusPageCacher = require("../cache/statuspage.js");
const HetznerInitializer = require("../cache/hetzner.js");
const MediaChannelInitializer = require("../cache/mediaChannel.js");
const AutoStatusPage = require("../feature/autostatuspage.js");
const ManualStatusPage = require("../feature/manualstatuspage.js");
const { setTimeout } = require("node:timers/promises");

module.exports = new Event("clientReady", "CLIENT_READY", async (client) => {
    console.log(client.Color.green + `Successfully connected to Discord as ${client.user.tag}!` + client.Color.white);
    
  //  dns.setServers(["1.1.1.1"]); // dns trickery for mongo internals so connection doesnt refuse
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongoURI || "", {
        keepAlive: true,
        dbName: 'discord'
    }).then(() => {
        console.log(client.Color.green + `Connected to the database via host ${mongoose.connection.host}!` + client.Color.white);
    }).catch(err => { console.log(err); })

    client.registerToApi();

    /**
     * Init special features
     */
    client.AutoStatusPage = new AutoStatusPage(client, config.statuspage_update_interval);
    client.ManualStatusPage = new ManualStatusPage(client, config.statuspage_update_interval);

    /**
     * Init caching services
     */
    new StarboardInitializer(client);
    new MediaChannelInitializer(client);
    new PterodactylInitializer(client);
    new StatusPageCacher(client);
    new HetznerInitializer(client);
    console.log(client.Color.blue + `All systems ready!`);
});