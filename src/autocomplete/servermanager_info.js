const AutoCompleter = require("../structure/autocompleter.js");
const cachedData = require("../data/data.js");

module.exports = new AutoCompleter("servermanager.info", async (client, interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    const servers = cachedData.pterodactylServerList;

    if (servers == null) {
        return;
    }

     const filtered = servers.data?.filter(server => server.attributes.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())) ?? null;

     if (filtered == null) {
        return;
     }

    if (filtered.length > 25) {
        const difference = filtered.length - 25;
        filtered.splice(-difference);
    }
    await interaction.respond(filtered.map(server => ({ name: `${server.attributes.name}`, value: `${server.attributes.uuid} ` })))
})