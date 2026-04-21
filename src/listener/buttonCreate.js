const Event = require("../structure/event.js");
const Button = require("../structure/button.js");

module.exports = new Event("interactionCreate", "BUTTON_CREATE", async (client, interaction) => {
    if (!interaction.isButton()) {
        return;
    }

    /**
     * @type {Button}
     */

    const button = client.buttonCollection.get(interaction.customId);
    if (!button) {
        return;
    }

    button.execute(client, interaction);
    
})