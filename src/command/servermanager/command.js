const Subcommand = require("../../structure/subcommand.js");
const cachedData = require("../../data/data.js");
const config = require("../../data/config.json");
const NodeactylClient = require("nodeactyl/src/client/Client.js");
module.exports = new Subcommand("command", null, async (client, interaction) => {

    if (cachedData.pterodactylAuthList.get(interaction.user.id) == null) {
        interaction.reply({ flags: "Ephemeral", content: "It seems like you do not have a Pterodactyl account linked. Please link it via /link pterodactyl."});
        return;
    }

    const application = new NodeactylClient(config.ptero_host, cachedData.pterodactylAuthList.get(interaction.user.id));
    const id = interaction.options.getString("server_id");
    const command = interaction.options.getString("command");
    await interaction.deferReply({ flags: "Ephemeral" });

    let status;
    try {
      status = await application.getServerStatus(id);
    } catch (exception) {
        interaction.followUp({ flags: "Ephemeral", content: "This server does not exist or you do not have permission to access to it!"});
        return;
    }

    if (status.toString() == "offline") {
        interaction.followUp({ flags: "Ephemeral", content: "This server is offline!"})
        return;
    }

    try {
        
    await application.sendServerCommand(id, command);
    interaction.followUp({ flags: "Ephemeral", content: "Executed the command." });
    } catch (exception) {
        interaction.followUp({ flags: "Ephemeral", content: "Something went wrong. Please try again later." });
    }



})