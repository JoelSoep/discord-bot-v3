const { ChatInputCommandInteraction } = require("discord.js");
const Client = require("./client.js");

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 */

function execute(client, interaction) {}

class Subcommand {

    /**
     * @param {String} name
     * @param {String} group
     * @param {execute} execute
     */

    constructor(name, group, execute) {
        this.name = name;
        this.group = group;
        this.execute = execute;
    }
}

module.exports = Subcommand;