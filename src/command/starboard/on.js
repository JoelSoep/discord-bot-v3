const Subcommand = require("../../structure/subcommand.js");
const schema = require("../../schema/starboard.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("on", null, async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        if (data) {
            if (data.Channel.includes(interaction.channel.id)) {
                interaction.reply({ content: "This channel already has starboard enabled!", flags: "Ephemeral" });
                return;
            }

            data.Channel.push(interaction.channel.id);
        } else {
            data = new schema({
                Guild: interaction.guild.id,
                Channel: interaction.channel.id
            });
        }

        await data.save();
        Data.starboardList.push(interaction.channel.id);
        interaction.reply({ content: "Starboard has been enabled!", flags: "Ephemeral" });
    })
})