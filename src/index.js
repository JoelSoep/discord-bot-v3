/**
 * © 2026 JoelSoep. All rights reserved.
 *
 * This software is proprietary and confidential.
 * Unauthorized copying, modification, or distribution of this software,
 * or any portion of it, is strictly prohibited and may result in legal action.
 *
 */

const Client = require("./structure/client.js");
const config = require("./data/config.json");
const Websocket = require("./websocket/websocket.js");

/**
 * ONLY WHILE INTERNALLY USED
 * DISABLES ALL TLS CHECKS
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = new Client();
client.loadEvents();
client.loadCommands();
client.loadButtons();
client.start(config.token);

const ws = new Websocket(client);
