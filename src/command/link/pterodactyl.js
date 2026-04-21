const Subcommand = require("../../structure/subcommand.js");
const schema = require("../../schema/pterodactyluser.js");
const Nodeactyl = require("nodeactyl");
const config = require("../../data/config.json");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const cachedData = require("../../data/data.js");
module.exports = new Subcommand("pterodactyl", null, async (client, interaction) => {

   const key = interaction.options.getString("key");
   const user = interaction.member;
   
   if (key == null) {
    interaction.reply({ flags: "Ephemeral", content: "Something went wrong. Please try again later."});
    return;
   }

   if (!key.startsWith("ptlc_")) {
    interaction.reply({ flags: "Ephemeral", content: "Invalid key. Are you sure that it is correct?"});
    return;
   }

   if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages, false)) {
    interaction.reply({ flags: "Ephemeral", content: "You do not have permission to use this command."});
    return;
   }

   schema.findOne({
    Guild: interaction.guild.id,
    UserId: user.id
   }, async (err, data) => {
    if (err) throw err;

    if (!data) {
        data = new schema({
            Guild: interaction.guild.id,
            UserId: user.id,
            API_Key: key
        });
    } else {
        data.API_Key = key;
    }

    const application = new Nodeactyl.NodeactylClient(config.ptero_host, key);
    let details;
    try {
    await interaction.deferReply({ flags: "Ephemeral" });
    details = await application.getAccountDetails();
    } catch (exception) {
        interaction.editReply({ flags: "Ephemeral", content: "Invalid API Key."});
        return;
    }

    const embed = new EmbedBuilder()
    .setTitle("Account details for " + details.username.toString())
    .setColor(15548997)
    .addFields(
        { name: "**ID**:", value: details.id.toString() },
        { name: "**Admin**:", value: details.admin ? "Yes" : "No" },
        { name: "**Username**:", value: details.username.toString() },
        { name: "**Email**:", value: details.email.toString() },
        { name: "**Full name**:", value: details.first_name.toString() + " " + details.last_name.toString() },
        )

        await interaction.editReply({ flags: "Ephemeral", embeds: [embed] })
        cachedData.pterodactylAuthList.set(user.id, key);
    await data.save().then(() => interaction.followUp({ flags: "Ephemeral", content: "Successfully saved API key."}));
   });
});