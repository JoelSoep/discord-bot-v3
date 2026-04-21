const AutoCompleter = require("../structure/autocompleter.js");
const Data = require("../data/data.js");
module.exports = new AutoCompleter("statuspage.incident.create", async (client, interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    const components = Data.statusPageComponentList;

    if (components == null) {
        return;
    }

    const filtered = components.filter(component => component.name.startsWith(focusedOption.value));
    await interaction.respond(filtered.map(component => ({ name: `${component.name} | ${component.status}`, value: component.id })))
})