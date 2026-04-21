const Command = require("../structure/command.js");
const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder, SlashCommandStringOption } = require("discord.js");
module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("servermanager")
.setDescription("Manage MCManhunt servers")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("info")
.setDescription("Gets information about a specific server.")
.addStringOption(option => option
    .setName("server_id")
    .setDescription("The server's unique ID.")
    .setRequired(true)
    .setAutocomplete(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("start")
.setDescription("Starts the server.")
.addStringOption(option => option
    .setName("server_id")
    .setDescription("The server's unique ID.")
    .setRequired(true)
    .setAutocomplete(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("stop")
.setDescription("Stops the server")
.addStringOption(option => option
    .setName("server_id")
    .setDescription("The server's unique ID.")
    .setRequired(true)
    .setAutocomplete(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("command")
.setDescription("Sends a command to the server.")
.addStringOption(option => option
    .setName("server_id")
    .setDescription("The server's unique ID.")
    .setRequired(true)
    .setAutocomplete(true))
.addStringOption(option => option
    .setName("command")
    .setDescription("The command to be sent to the server.")
    .setRequired(true))),

    async (client, interaction) => {
        interaction.reply({ flags: "Ephemeral", content: "Please select an option."})
    }
)