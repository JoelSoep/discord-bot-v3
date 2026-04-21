const Discord = require("discord.js");

const pollList = new Discord.Collection();
const starboardList = [];
const mediaChannelList = [];
const commandNameList = [];
let statusPageIncidentList = [];
let statusPageComponentList = [];
let statusPageMaintenanceList = [];
let pterodactylServerList = [];
const hetznerAuthList = new Discord.Collection();
const hetznerServerList = new Discord.Collection();
const pterodactylAuthList = new Discord.Collection();
const autoStatusPageChannelList = new Discord.Collection();
const autoStatusPageMessagesList = new Discord.Collection();
const manualStatusPageChannelList = new Discord.Collection();
const manualStatusPageMessagesList = new Discord.Collection();

module.exports = {
    pollList: pollList,
    starboardList: starboardList,
    mediaChannelList: mediaChannelList,
    commandNameList: commandNameList,
    pterodactylAuthList: pterodactylAuthList,
    autoStatusPageChannelList: autoStatusPageChannelList,
    autoStatusPageMessagesList: autoStatusPageMessagesList,
    manualStatusPageChannelList: manualStatusPageChannelList,
    manualStatusPageMessagesList: manualStatusPageMessagesList,
    statusPageIncidentList: statusPageIncidentList,
    statusPageComponentList: statusPageComponentList,
    statusPageMaintenanceList: statusPageMaintenanceList,
    pterodactylServerList: pterodactylServerList,
    hetznerAuthList: hetznerAuthList,
    hetznerServerList: hetznerServerList
 }