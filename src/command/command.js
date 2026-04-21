const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandStringOption, SlashCommandSubcommandBuilder } = require("discord.js");
const Command = require("../structure/command.js");

module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("command")
.setDescription("Disables or enables a command on the server.")
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("disable")
.setDescription("Disable a command.")
.addStringOption(option => 
    option.setName("command")
    .setDescription("The command to disable.")))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("enable")
.setDescription("Enable a command.")
.addStringOption(option => 
    option.setName("command")
    .setDescription("The command to enable.")))
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async (client, interaction) => {
    interaction.reply({ content: "Please select a subcommand.", flags: "Ephemeral"});
});