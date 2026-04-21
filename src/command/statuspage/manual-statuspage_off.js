const schema = require("../../schema/manualStatusPage.js");
const Subcommand = require("../../structure/subcommand.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("off", "manualchannel", async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        if (data) {
            if (!data.Channel.includes(interaction.channel.id)) {
                interaction.reply({ content: "manual-statuspage isn't enabled in this channel!", flags: "Ephemeral" });
                return;
            }

            for (let i = 0; i < data.Channel.length; i++) {
                if (data.Channel[i] === interaction.channel.id) data.Channel.splice(i, 1);
            }

            await data.save();
            /** @type {string[]} */ const array = Data.manualStatusPageChannelList.get(interaction.guild.id);
            let index = array?.indexOf(interaction.channel.id);
            if (index > -1) {
                array.splice(index, 1);
                Data.manualStatusPageChannelList.set(interaction.guild.id, array);
            }
            interaction.reply({ content: "manual-statuspage has been disabled!", flags: "Ephemeral" })
        } else {
            interaction.reply({ content: "manual-statuspage isn't enabled in this channel!", flags: "Ephemeral" })
        }
    })
})