const Subcommand = require("../../structure/subcommand.js");
const cachedData = require("../../data/data.js");
const config = require("../../data/config.json");
const NodeactylClient = require("nodeactyl/src/client/Client.js");
const { EmbedBuilder } = require("@discordjs/builders");
module.exports = new Subcommand("info", null, async (client, interaction) => {

    if (cachedData.pterodactylAuthList.get(interaction.user.id) == null) {
        interaction.reply({ flags: "Ephemeral", content: "It seems like you do not have a Pterodactyl account linked. Please link it via /link pterodactyl."});
        return;
    }

    const application = new NodeactylClient(config.ptero_host, cachedData.pterodactylAuthList.get(interaction.user.id));
    const id = interaction.options.getString("server_id");
    await interaction.deferReply({ flags: "Ephemeral" });

    let details;
    let usages;
    let status;
    try {
    details = await application.getServerDetails(id);
    status = await application.getServerStatus(id);
    } catch (exception) {
        interaction.followUp("This server does not exist or you do not have access to it!");
        return;
    }

    try {
        status = await application.getServerUsages(id);
    } catch (exception) {}

    const embed = new EmbedBuilder()
    .setTitle(`Server Information`)
    .setColor(15548997)
    .addFields(
        { name: "**Server Name**:", value: details.name.toString() },
        { name: "**Node**:", value: details.node.toString() },
        { name: "**Memory**:", value: details.limits.memory.toString() },
        { name: "**Disk Space**:", value: details.limits.disk.toString() },
        { name: "**Status**:", value: status.current_state.toString() }
    )
    .setFooter({ text: `${details.uuid}`})

    interaction.followUp({ embeds: [embed] });

});