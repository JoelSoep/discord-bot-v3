const Subcommand = require("../../structure/subcommand.js");
const Statuspage = require('../../util/statuspage.js');
const config = require("../../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
const Data = require("../../data/data.js");
module.exports = new Subcommand("resolve", "incident", async (client, interaction) => {
    const id = interaction.options.getString("incident_id");

    if (!id) {
        return interaction.reply({ flags: "Ephemeral", content: "Please select a valid option." });
    } 

    let incident = Data.statusPageIncidentList.filter(incident => incident.id == id)[0];
    if (incident == null || incident?.components[0] == null) {
        interaction.followUp({ flags: "Ephemeral", content: "Couldn't find attached component." });
        return;
    }

    let componentId = incident.components[0].id;

    await interaction.deferReply({ flags: "Ephemeral" });
    try {
        await page.updateIncidentStatus(id, componentId, "operational", "resolved", "none", "This incident has been resolved.").then(() =>  {
            interaction.followUp({ flags: "Ephemeral", content: `Successfully resolved incident with ID \`${id}\`.`});
    })
    } catch (err) {
        interaction.followUp({ flags: "Ephemeral", content: "Something went wrong, are you sure that this incident exists?" })
    }
})