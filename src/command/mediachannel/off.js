const schema = require("../../schema/mediaChannel.js");
const Subcommand = require("../../structure/subcommand.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("off", null, async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        if (data) {
            if (!data.Channel.includes(interaction.channel.id)) {
                interaction.reply({ content: "This channel is not a media channel!", flags: "Ephemeral" });
                return;
            }

            for (let i = 0; i < data.Channel.length; i++) {
                if (data.Channel[i] === interaction.channel.id) data.Channel.splice(i, 1);
            }

            await data.save();
            const index = Data.mediaChannelList.indexOf(interaction.channel.id);
            if (index > -1) {
                Data.mediaChannelList.splice(index, 1);
            }
            interaction.reply({ content: "This channel has been unregistered as a media channel.", flags: "Ephemeral" })
        } else {
            interaction.reply({ content: "This channel is not a media channel!", flags: "Ephemeral" })
        }
    })
})