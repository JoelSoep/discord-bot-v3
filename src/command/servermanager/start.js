const NodeactylClient = require("nodeactyl/src/client/Client.js");
const Subcommand = require("../../structure/subcommand.js");
const config = require("../../data/config.json");
const cachedData = require("../../data/data.js");
module.exports = new Subcommand("start", null, async (client, interaction) => {

    if (cachedData.pterodactylAuthList.get(interaction.user.id) == null) {
        interaction.reply({ flags: "Ephemeral", content: "It seems like you do not have a Pterodactyl account linked. Please link it via /link pterodactyl."});
        return;
    }

    const application = new NodeactylClient(config.ptero_host, cachedData.pterodactylAuthList.get(interaction.user.id));
    const id = interaction.options.getString("server_id");

    await interaction.deferReply({ flags: "Ephemeral" });
    let status;
    try {
       status = await application.getServerStatus(id);
    } catch (exception) {
        interaction.followUp({ flags: "Ephemeral", content: "This server does not exist or you do not have access to it!"});
        return;
    }

    if (status == "running") {
        interaction.followUp({ flags: "Ephemeral", content: "This server is already online!" })
        return;
    }

    try {
    await application.startServer(id).then(() => interaction.followUp({ flags: "Ephemeral", content: "Started the server!" }))
    } catch (exception) {
        interaction.followUp({ flags: "Ephemeral", content: "The server could not be started. Please try again later." });
    }
    
})