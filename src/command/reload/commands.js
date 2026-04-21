const Subcommand = require("../../structure/subcommand.js");

module.exports = new Subcommand("commands", null, async (client, interaction) => {
    const oldTime = Date.now();
    console.log(`Reloading commands... (Requested by ${interaction.user.tag})`);
    await client.loadCommands().then(() => interaction.reply({ flags: "Ephemeral", content: "Loaded  all commands. Registering to the Discord API..."}));
    await client.registerToApi().then(() => interaction.editReply({ content: `Finished reloading commands. (Took ${Date.now() - oldTime}ms.)` }));

});