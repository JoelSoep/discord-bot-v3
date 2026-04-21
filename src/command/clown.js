const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Command = require("../structure/command.js");
module.exports = new Command(
    {
        hasSubCommand: false,
        isDeveloper: false,
        isGlobal: false
    },

    new SlashCommandBuilder()
    .setName("clown")
    .setDescription("Clowns another user.")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to clown.")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async (client, interaction) => {

        const user = interaction.options.getUser("user");
        const member = interaction.guild.members.cache.get(user.id);

        if (user == null) {
            interaction.reply({ flags: "Ephemeral", content: "This user doesn't exist!" });
            return;
        }

        if (member == null) {
            interaction.reply({ flags: "Ephemeral", content: "This user doesn't exist!" });
            return;
        }

        if (member.roles.cache.find(r => r.name === "Administration") && !interaction.member.roles.cache.find(r => r.name === "Administration")) {
           await interaction.reply({ content: "Bro tried to clown an admin :clown:" });
            interaction.followUp({ content: `:clown::clown::clown: <@${interaction.user.id}> :clown::clown::clown:`});
            return;
        }

        interaction.reply({ content: `:clown::clown::clown: <@${user.id}> :clown::clown::clown:`});
    }
)