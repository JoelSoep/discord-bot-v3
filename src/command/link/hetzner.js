const Subcommand = require("../../structure/subcommand.js");
const schema = require("../../schema/hetzneruser.js");
const Cloud = require("hetzner-cloud-api");
const config = require("../../data/config.json");
const allowed = require("../../data/allowed_servers.json");
const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const cachedData = require("../../data/data.js");
module.exports = new Subcommand("hetzner", null, async (client, interaction) => {

   const key = interaction.options.getString("key");
   const organization = interaction.options.getString("organization");
   const user = interaction.member;
   
   if (key == null || organization == null) {
    interaction.reply({ flags: "Ephemeral", content: "Something went wrong. Please try again later."});
    return;
   }

   if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    interaction.reply({ flags: "Ephemeral", content: "You do not have permission to use this command."});
    return;
   }

   schema.findOne({
    Guild: interaction.guild.id,
    UserId: user.id,
    Organization: organization
   }, async (err, data) => {
    if (err) throw err;

    if (!data) {
        data = new schema({
            Guild: interaction.guild.id,
            UserId: user.id,
            Organization: organization,
            API_Key: key
        });
    } else {
        data.API_Key = key;
    }

    let result;
    try {
        const hetzner = new Cloud(key);
        result = await hetzner.getServers();

        if (!allowed.ids.includes(result.servers[0].id.toString())) {
            interaction.reply({ flags: "Ephemeral", content: "This API key is not allowed for remote control. Please contact the bot developer for more information." });
            return;
        }
    } catch (err) {
        if (err.data.error.code == "unauthorized") {
            interaction.reply({ flags: "Ephemeral", content: "Your account has insufficient permissions to be registered."});
            return;
        }

        interaction.reply("It seems like this is not a valid token. Please try again.")
    }

    const embed = new EmbedBuilder()
    .setTitle("Account has been registered.")
    .setColor(15548997)
    .setDescription("Successfully registered your token.\nThis gives you access to the following servers: ")
    result.servers.forEach(server => {
        embed.addFields({ name: `${server.name}`, value: `${server.id}` });
    });


        await interaction.reply({ flags: "Ephemeral", embeds: [embed] });
        const current = cachedData.hetznerAuthList.get(user.id);
        if (current == null) {
        cachedData.hetznerAuthList.set(user.id, new Map().set(organization, key));
        } else {
            current.set(organization, key);
        }
    await data.save().then(() => interaction.followUp({ flags: "Ephemeral", content: "Successfully saved API key."}));
   });
});