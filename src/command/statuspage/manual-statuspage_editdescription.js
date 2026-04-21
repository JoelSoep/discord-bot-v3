const Subcommand = require("../../structure/subcommand.js");
const fs = require("fs");

module.exports = new Subcommand("editdescription", "manualchannel", async (client, interaction) => {
    // also put description to local cache file
    const description = interaction.options.getString("manualchannel_description");
    if (description == null) {
        return interaction.reply({ flags: "Ephemeral" , content: "Please enter a description." });
    }
    
    client.ManualStatusPage.overrideDescription = description;
    fs.writeFileSync("./cache/cached_manualstatuspage_description.json", JSON.stringify(description, null, 2));
    interaction.reply({ flags: "Ephemeral", content: "Updated description." });
});