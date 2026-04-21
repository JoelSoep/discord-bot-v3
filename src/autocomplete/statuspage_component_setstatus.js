const AutoCompleter = require("../structure/autocompleter.js");
const Statuspage = require('../util/statuspage.js');
const Data = require("../data/data.js");
const config = require("../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
module.exports = new AutoCompleter("statuspage.component.setstate", async (client, interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    const components = Data.statusPageComponentList;

    if (components == null) {
        return;
    }

    const filtered = components.filter(component => component.name.startsWith(focusedOption.value));
    await interaction.respond(filtered.map(component => ({ name: `${component.name} | ${component.status}`, value: component.id })))
})