const Subcommand = require("../../structure/subcommand.js");
const Statuspage = require('../../util/statuspage.js');
const config = require("../../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
const Data = require("../../data/data.js");
module.exports = new Subcommand("update", "incident", async (client, interaction) => {
    const id = interaction.options.getString("incident_id");
    const status = interaction.options.getString("incident_status");
    const impact = interaction.options.getString("incident_impact");
    const body = interaction.options.getString("incident_body");

    if (!id || !status || !body || !impact) {
        interaction.reply({ flags: "Ephemeral", content: "Please select a valid option." });
        return;
    }

    let componentStatus;
    switch (impact) {
        case 'minor': componentStatus = 'degraded_performance'; break;
        case 'major': componentStatus = 'partial_outage'; break;
        case 'critical': componentStatus = 'major_outage'; break;
        case 'maintenance': componentStatus = 'under_maintenance'; break;
        default: componentStatus = 'operational'; break;
    }

    await interaction.deferReply({ flags: "Ephemeral" });

    let incident = Data.statusPageIncidentList.filter(incident => incident.id == id)[0];
    if (incident == null || incident?.components[0] == null) {
        interaction.followUp({ flags: "Ephemeral", content: "Couldn't find attached component." });
        return;
    }

    let componentId = incident.components[0].id;
    try {
        await page.updateIncidentStatus(id, componentId, componentStatus, status, impact, body).then(() => {
            interaction.followUp({ flags: "Ephemeral", content: `Successfully updated the incident.` });
        })
    } catch (err) {
        interaction.followUp({ flags: "Ephemeral", content: "Something went wrong, are you sure that this incident exists and that the status is valid?" })
    }
})