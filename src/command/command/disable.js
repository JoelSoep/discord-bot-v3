const schema = require("../../schema/command.js");
const Subcommand = require("../../structure/subcommand.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("disable", null, async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
    if (err) throw err;

    const command = interaction.options.getString("command");

    if (command == null) {
        interaction.reply("Something went wrong. Please try again.")
        return;
    }

    if (data) {
        if (data.command.includes(command)) {
            interaction.reply("This command is already disabled!");
            return;
        }

        if (!client.commandCollection.get(command)) {
            interaction.reply({ content: "This command doesn't exist!", flags: "Ephemeral" });
            return;
        }

        data.command.push(command);
    } else {
        data = new schema({
            Guild: interaction.guild.id,
            command: command
        });
    }
    await data.save();
    Data.commandNameList.push(command);
    interaction.reply(`${command} has been disabled!`);
})
});