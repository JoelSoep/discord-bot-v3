const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const Command = require("../structure/command.js");

module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("reload")
.setDescription("Reloads the bot.")
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("commands")
.setDescription("Reloads the commands."))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("events")
.setDescription("Reloads the events.")),

async (client, interaction) => {
    interaction.reply({ content: "Please select a subcommand.", flags: "Ephemeral"});
}
)