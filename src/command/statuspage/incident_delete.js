const Subcommand = require("../../structure/subcommand.js");
const Statuspage = require('../../util/statuspage.js');
const config = require("../../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
module.exports = new Subcommand("delete", "incident", async (client, interaction) => {
    const id = interaction.options.getString("incident_id");

    if (!id) {
        return interaction.reply({ flags: "Ephemeral", content: "Please select a valid option." });
    } 

    await interaction.deferReply({ flags: "Ephemeral" });

    try {
        await page.deleteIncident(id).then(() =>  {
            interaction.followUp({ flags: "Ephemeral", content: `Successfully deleted incident with ID \`${id}\`.`});
    })
    } catch (err) {
        interaction.followUp({ flags: "Ephemeral", content: "Something went wrong, are you sure that this incident exists?" })
    }
})