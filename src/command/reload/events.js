const Subcommand = require("../../structure/subcommand.js");

module.exports = new Subcommand("events", null, async (client, interaction) => {
    console.log(`Reloading events... (Requested by ${interaction.user.tag})`);
    await client.loadEvents().then(() => interaction.reply({flags: "Ephemeral", content: `Reloaded all events. (Took ${interaction.createdTimestamp - Date.now()}`}));
});