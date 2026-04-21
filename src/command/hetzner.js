const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
const Command = require("../structure/command.js");
module.exports = new Command({
    isDeveloper: true,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("hetzner")
.setDescription("Manage Hetzner servers via Discord.")
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("reboot")
.setDescription("Reboots the server.")
.addStringOption(option => option
    .setName("server_id")
    .setDescription("The server's ID.")
    .setAutocomplete(true)
    .setRequired(true))
.addStringOption(option => option
    .setName("auth_provider")
    .setDescription("The company that owns the server.")
    .addChoices(
        { name: `MCManhunt`, value: `MCManhunt` }
        )
    .setRequired(true))),
    
async (client, interaction) => {
    return interaction.reply("Please select an option.");
})