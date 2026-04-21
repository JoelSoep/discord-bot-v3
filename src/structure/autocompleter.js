const { ChatInputCommandInteraction } = require("discord.js");
const Client = require("./client.js");

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */

function execute(client, interaction) {}


class Autocompleter {

    /**
     * @param {String} name
     * @param {execute} execute
     */

constructor(name, execute) {
    this.name = name;
    this.execute = execute;
}

}

module.exports = Autocompleter;