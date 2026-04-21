const Subcommand = require("../../structure/subcommand.js");
const Statuspage = require('../../util/statuspage.js');
const config = require("../../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);

module.exports = new Subcommand("create", "incident", async (client, interaction) => {

    const name = interaction.options.getString("incident_name");
    const status = interaction.options.getString("incident_status");
    const impact = interaction.options.getString("incident_impact");
    const component = interaction.options.getString("incident_component");
    const body = interaction.options.getString("incident_body");

    if (!name || !status || !body || !component || !impact) {
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
    try {
        await page.createIncident(name, component, componentStatus, status, impact, body).then(incident => {
            interaction.followUp({ flags: "Ephemeral", content: `Successfully created incident, visit ${incident.data.shortlink} to view it.` })
    });
    } catch(err) {
        console.error(err)
    }
});