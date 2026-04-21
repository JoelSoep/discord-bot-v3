const schema = require("../../schema/autoStatusPage.js");
const Subcommand = require("../../structure/subcommand.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("off", "autochannel", async (client, interaction) => {
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        if (data) {
            if (!data.Channel.includes(interaction.channel.id)) {
                interaction.reply({ content: "auto-statuspage isn't enabled in this channel!", flags: "Ephemeral" });
                return;
            }

            for (let i = 0; i < data.Channel.length; i++) {
                if (data.Channel[i] === interaction.channel.id) data.Channel.splice(i, 1);
            }

            await data.save();
            /** @type {string[]} */ const array = Data.autoStatusPageChannelList.get(interaction.guild.id);
            let index = array?.indexOf(interaction.channel.id);
            if (index > -1) {
                array.splice(index, 1);
                Data.autoStatusPageChannelList.set(interaction.guild.id, array);
            }
            interaction.reply({ content: "auto-statuspage has been disabled!", flags: "Ephemeral" })
        } else {
            interaction.reply({ content: "auto-statuspage isn't enabled in this channel!", flags: "Ephemeral" })
        }
    })
})