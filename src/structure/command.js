const Discord = require("discord.js");
const Client = require("./client.js");
const { SlashCommandBuilder } = require("discord.js");

/**
 * @param {Discord.ChatInputCommandInteraction} interaction
 * @param {Client} client
 */

function execute(client, interaction) {}

class Command {

    /**
     * @param {SlashCommandBuilder} data
     * @param {execute} execute
     * 
     * @typedef {{ isDeveloper: Boolean, isGlobal: Boolean, hasSubCommand: Boolean }} CommandOptions
     * @param {CommandOptions} options
     */

    constructor(options, data, execute) {
        this.data = data;
        this.isDeveloper = options.isDeveloper;
        this.isGlobal = options.isGlobal;
        this.hasSubCommand = options.hasSubCommand;
        this.execute = execute;
    }
}

module.exports = Command;