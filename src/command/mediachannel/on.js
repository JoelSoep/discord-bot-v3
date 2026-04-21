const Subcommand = require("../../structure/subcommand.js");
const schema = require("../../schema/mediaChannel.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("on", null, async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        if (data) {
            if (data.Channel.includes(interaction.channel.id)) {
                interaction.reply({ content: "This channel is already registered as a media channel!", flags: "Ephemeral" });
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
        Data.mediaChannelList.push(interaction.channel.id);
        interaction.reply({ content: "The channel has been registered as a media channel!", flags: "Ephemeral" });
    })
})