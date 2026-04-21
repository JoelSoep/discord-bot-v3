const Autocompleter = require("../structure/autocompleter.js");
const Cloud = require("hetzner-cloud-api");
const cachedData = require("../data/data.js");
module.exports = new Autocompleter("hetzner.reboot", async (client, interaction) => {

    const focusedOption = interaction.options.getFocused(true);
    const user = interaction.member;
    let serverList = [];

    if (user == null) {
        return;
    }

    let dataMap = cachedData.hetznerServerList.get(user.id);
    if (dataMap == null) {
        return;
    }
    dataMap.forEach(data => {
        data.servers.forEach(server => serverList.push(server));
    })
    const filtered = serverList.filter(server => server.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));


    await interaction.respond(filtered.map(server => ({ name: `${server.name} | ${server.public_net.ipv4.ip}`, value: `${server.id}` })));
    
    
})