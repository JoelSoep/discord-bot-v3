const AutoCompleter = require("../structure/autocompleter.js");
const Statuspage = require('../util/statuspage.js');
const Data = require("../data/data.js");
const config = require("../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
module.exports = new AutoCompleter("statuspage.incident.update", async (client, interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    const incidents = Data.statusPageIncidentList;

    if (incidents == null) {
        return;
    }

    const filtered = incidents.filter(incident => incident.name.startsWith(focusedOption.value));
    await interaction.respond(filtered.map(incident => ({ name: `${incident.name} | ${incident.status}`, value: incident.id })))
})