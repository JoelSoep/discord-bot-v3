const Command = require("../structure/command.js");
const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder } = require("discord.js");
module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("link")
.setDescription("Links an account to your Discord account.")
.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("pterodactyl")
.setDescription("Links your Pterodactyl account to your Discord account. Staff only!")
.addStringOption(option => 
    option.setName("key")
    .setDescription("Your Pterodactyl API key.")
    .setRequired(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("hetzner")
.setDescription("Links your Hetzner account to your Discord account. Administrators only!")
.addStringOption(option => option
    .setName("key")
    .setDescription("Your Hetzner Cloud API key.")
    .setRequired(true))
.addStringOption(option => option
    .setName("organization")
    .setDescription("The key where the organization belongs to.")
    .setChoices(
        { name: "MCManhunt", value: "MCManhunt" }
    )
    .setRequired(true))),
    
    async (client, interaction) => {
        interaction.reply({ flags: "Ephemeral", content: "Please select an option." })
    })