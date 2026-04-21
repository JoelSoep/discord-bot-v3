const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const Command = require("../structure/command.js");

module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("mediachannel")
.setDescription("Registers a channel as a media channel.")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("on")
.setDescription("Registers the current channel as a media channel."))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("off")
.setDescription("Unregisters the current channel as a media channel.")),

async (client, interaction) => {
    interaction.reply({ content: "Please select a subcommand.", flags: "Ephemeral"});
}
)