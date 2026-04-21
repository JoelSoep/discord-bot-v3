const { SlashCommandBuilder } = require("discord.js")
const Command = require("../structure/command.js");

module.exports = new Command({
    isDeveloper: false,
    isGlobal: true,
    hasSubCommand: false
},

new SlashCommandBuilder()
.setName("ping")
.setDescription("displays the latency between the client and the user."),

async (client, interaction) => {
        interaction.reply({ content: `Ping: ${client.ws.ping} ms.`, flags: "Ephemeral"});
});