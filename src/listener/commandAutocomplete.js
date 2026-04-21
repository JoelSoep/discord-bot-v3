const Event = require("../structure/event.js");
module.exports = new Event("interactionCreate", "COMMAND_AUTOCOMPLETE", async (client, interaction) => {
    if (!interaction.isAutocomplete()) {
        return;
    }

    const command = client.commandCollection.get(interaction.commandName);
    const subcommandName = interaction.options.getSubcommand(false);
    const subcommandGroupName = interaction.options.getSubcommandGroup(false);

    if (!command) return;

    if (!subcommandName) {
        const autocomplete = client.autocompleteCollection.get(interaction.commandName);
        if (!autocomplete) return console.log(client.Color.red + "Couldn't find autocomplete option for user " + interaction.user.id + `(${interaction.commandName})` + client.Color.white);

        return autocomplete.execute(client, interaction);
    }

    if (subcommandGroupName) {
        const autocomplete = client.autocompleteCollection.get(interaction.commandName + "." + subcommandGroupName + "." + subcommandName);
        if (!autocomplete) return console.log(client.Color.red + "Couldn't find autocomplete option for user " + interaction.user.id + ` (${interaction.commandName}.${subcommandName})`);

        return autocomplete.execute(client, interaction);
    }

    const autocomplete = client.autocompleteCollection.get(interaction.commandName + '.' + subcommandName);
    if (!autocomplete) return console.log(client.Color.red + "Couldn't find autocomplete option for user " + interaction.user.id + ` (${interaction.commandName}.${subcommandName})`);

    return autocomplete.execute(client, interaction);
})