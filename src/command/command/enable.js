const schema = require("../../schema/command.js");
const Subcommand = require("../../structure/subcommand.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("enable", null, async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        const command = interaction.options.getString("command");

        if (command == null) {
            interaction.reply("Something went wrong. Please try again.")
            return;
        }

        if (!client.commandCollection.get(command)) {
            interaction.reply({ content: "This command doesn't exist!", flags: "Ephemeral" });
            return;
        }

        if (data) {
            if (data.command.includes(command)) {
                for (let i = 0; i < data.command.length; i++) {
                    if (data.command[i] === command) data.command.splice(i, 1);
                }
                await data.save();
                let index = Data.commandNameList.indexOf(command)
                if (index > -1) {
                    Data.commandNameList.splice(index, 1);
                }
                interaction.reply(`${command} has been enabled!`);
                return;
            } else {
                interaction.reply("That command is already enabled!");
                return;
            }
        }
        interaction.reply("That command is already enabled!");
    })
});