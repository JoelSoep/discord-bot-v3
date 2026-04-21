const Subcommand = require("../../structure/subcommand.js");
const Statuspage = require('../../util/statuspage.js');
const config = require("../../data/config.json");
const page = new Statuspage(config.atlassian_api_key, config.atlassian_page_id);
module.exports = new Subcommand("setstate", "component", async (client, interaction) => {
    const id = interaction.options.getString("component_id");
    const state = interaction.options.getString("component_status");

    if (!id || !state) {
        interaction.reply({ flags: "Ephemeral", content: "Please specify a valid option." });
        return;
    }

    await interaction.deferReply({ flags: "Ephemeral" });

    try {
        await page.updateComponentState(id, state).then(() => {
            interaction.followUp({ flags: "Ephemeral", content: "Successfully updated the component." });
        })
    } catch (err) {
        interaction.followUp({ flags: "Ephemeral", content: "Something went wrong, are you sure that this component exists and that the status is valid?"})
    }

})