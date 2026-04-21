const Subcommand = require("../../structure/subcommand.js");
const schema = require("../../schema/manualStatusPage.js");
const Data = require("../../data/data.js");

module.exports = new Subcommand("on", "manualchannel", async (client, interaction) => {

    if (!interaction.channel.isTextBased()) {
        interaction.reply({ content: "This channel is not a text channel!" });
        return;
    }
    
    schema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        if (data) {
            if (data.Channel.includes(interaction.channel.id)) {
                interaction.reply({ content: "This channel already has manual-statuspage enabled!", flags: "Ephemeral" });
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
        
        /** @type {string[]} */ 
        let array = Data.manualStatusPageChannelList.get(interaction.guild.id);
        array.push(interaction.channel.id);
        Data.manualStatusPageChannelList.set(interaction.guild.id, array);
        interaction.reply({ content: "Manual-statuspage has been enabled!", flags: "Ephemeral" });
    })
})