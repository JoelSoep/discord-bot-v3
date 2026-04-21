const Client = require("./client.js");
const Discord = require("discord.js");

/**
 * @param {Client} client
 * @param {Discord.ButtonInteraction} interaction
 */

function execute(client, interaction) {}

class Button {

    /**
     * @param {String} name
     * @param {execute} execute
     */

    constructor(name, execute) {
        this.name = name;
        this.execute = execute;
    }
}

module.exports = Button;