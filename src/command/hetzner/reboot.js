const Subcommand = require("../../structure/subcommand.js");
const Cloud = require("hetzner-cloud-api");
const schema = require("../../schema/hetzneruser.js");
const cachedData = require("../../data/data.js");
module.exports = new Subcommand("reboot", null, async (client, interaction) => {

    const user = interaction.member;
    const id = interaction.options.getString("server_id");
    const auth = interaction.options.getString("auth_provider");
    if (user.id == null || id == null || auth == null) {
        interaction.reply("An error occured. Please contact a bot administrator.");
        return;
    }

    let data = cachedData.hetznerAuthList.get(user.id); 

    if (data == null) {
        interaction.reply({ flags: "Ephemeral", content: `It seems like you do not have a linked hetzner account. Please link it via /link hetzner.` });
        return;
    }

    let provider = data.get(auth);

    if (provider == null) {
        interaction.reply({ flags: "Ephemeral", content: `It seems like you do not have a linked hetzner account registered for this provider. Please link it via /link hetzner.`});
        return;
    }

    const hetzner = new Cloud(provider);
    try {
        hetzner.rebootServer(id).then(() => {
            interaction.reply({ flags: "Ephemeral", content: `Successfully rebooted server with id \`${id}\`.` })
        })
    } catch (err) {
        if (err.data.error.code == "unauthorized") {
            interaction.reply({ flags: "Ephemeral", content: "Your account has insufficient permissions to be registered."});
            return;
        }

        interaction.reply({ flags: "Ephemeral", content: `**Something went wrong.**\nYour account might not have the right permissions set, or your API key is invalid.\nIf you have any questions, please contact a system administrator.` });
    }
    

    
    

});