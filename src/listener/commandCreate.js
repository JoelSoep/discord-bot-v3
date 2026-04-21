const Event = require("../structure/event.js");
const schema = require("../schema/command.js");
const developmentConfig = require("../data/development.json");
const { CooldownUtil } = require("../util/cooldown.js");
const { PermissionFlagsBits } = require("discord.js");
const devConfig = require("../data/development.json");
const Data = require("../data/data.js");

module.exports = new Event("interactionCreate", "COMMAND_CREATE", async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (await client.cooldown.getCooldown(interaction.user.id) > Date.now().valueOf()) {
        interaction.reply({ flags: "Ephemeral", content: `I can't keep up, you're going too fast!` });
        return;
    }

    const command = client.commandCollection.get(interaction.commandName);
    const subcommandName = interaction.options.getSubcommand(false);
    const subcommandGroupName = interaction.options.getSubcommandGroup(false);
    if (!command) return;

    if (!devConfig.superusers.includes(interaction.userId)) {
        client.cooldown.setCooldown(interaction.user.id);
    }

    if (interaction.guild !== null) {
        if (Data.commandNameList.includes(interaction.commandName) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !developmentConfig.superusers.includes(interaction.user.id)) {
            interaction.reply("This command has been disabled by a server Administrator!");
            return;
        }
        
        if (!subcommandName) return command.execute(client, interaction);

        if (subcommandGroupName) {
            const subcommand = client.subcommandCollection.get(interaction.commandName + "." + subcommandGroupName + "." + subcommandName);
            if (!subcommand) return;

            return subcommand.execute(client, interaction);
        }

        const subcommand = client.subcommandCollection.get(interaction.commandName + "." + subcommandName);
        if (!subcommand) return;
    
        return subcommand.execute(client, interaction);
    }
    
    if (!subcommandName) {
        return command.execute(client, interaction);
    }

    if (subcommandGroupName) {
        const subcommand = client.subcommandCollection.get(interaction.commandName + "." + subcommandGroupName + "." + subcommandName);
        if (!subcommand) return;

        return subcommand.execute(client, interaction);
    }

    const subcommand = client.subcommandCollection.get(interaction.commandName + "." + subcommandName);

    if (!subcommand) {
        return;
    }

    subcommand.execute(client, interaction);

})