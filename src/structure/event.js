/** @format */

const Discord = require("discord.js");
const Client = require("./client.js");

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {Client} client
 * @param {Discord.ClientEvents[K]} eventArgs
 */

function run(client, ...eventArgs) {}

/**
 * @template {keyof Discord.ClientEvents} K
 */

class Event {
/**
 * @param {K} event
 * @param {name} name
 * @param {run} run
 */

constructor(event, name, run) {
    this.event = event;
    this.name = name;
    this.run = run;
}
}

module.exports = Event;