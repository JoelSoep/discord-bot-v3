const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const Command = require("../structure/command.js");

module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("starboard")
.setDescription("Automatically reacts to a message with a reaction in the current channel!")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("on")
.setDescription("turns the starboard on in the current channel."))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("off")
.setDescription("turns the starboard off in the current channel.")),

async (client, interaction) => {
    interaction.reply({ content: "Please select a subcommand.", flags: "Ephemeral"});
}
)