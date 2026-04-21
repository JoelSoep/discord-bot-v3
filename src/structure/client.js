const Discord = require("discord.js");
const fs = require("fs");
const intents = new Discord.IntentsBitField(32767);
const Event = require("./event.js");
const Autocompleter = require("./autocompleter.js");
const config = require("../data/config.json");
const { REST, Routes, GatewayIntentBits } = require("discord.js");
const developmentConfig = require("../data/development.json");
const Command = require("./command.js");
const Button = require("./button.js");
const Subcommand = require("./subcommand.js");
const Color = require("../util/color.js");
const CooldownUtil = require("../util/cooldown.js");
const Nodeactyl = require("nodeactyl");
const AutoStatusPage = require("../feature/autostatuspage.js");
const ManualStatusPage = require("../feature/manualstatuspage.js");

class Client extends Discord.Client {
    constructor() {
        super ({ intents: [
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution,
            GatewayIntentBits.DirectMessagePolls,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildExpressions,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessagePolls,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.Guilds
        ] });

        this.commandCollection = new Discord.Collection();
        this.subcommandCollection = new Discord.Collection();
        this.buttonCollection = new Discord.Collection();
        this.autocompleteCollection = new Discord.Collection();
        this.commands = [];
        this.globalCommands = [];
        this.developerCommands = [];
        this.rest = new REST({version: '10'}).setToken(config.token);
        this.Color = new Color();
        this.cooldown = new CooldownUtil();
        this.pterodactyl = new Nodeactyl.NodeactylApplication("https://panel.mcmanhunt.com", config.ptero_api_key);
        /** @type {AutoStatusPage} */this.AutoStatusPage;
        /** @type {ManualStatusPage} */ this.ManualStatusPage;
    }

    async start(token) {
        console.log("Logging in...");
        this.login(token);
    }

    async loadEvents() {
        this.removeAllListeners();
        fs.readdirSync("./src/listener")
        .filter(file => file.endsWith(".js"))
        .forEach(file => {

            /**
             * @type {Event}
             */

            const event = require(`../listener/${file}`);
            this.on(event.event, event.run.bind(null, this));
            console.log(this.Color.green + `Event ${event.name} was successfully registered!` + this.Color.white);
        });
    }

    async loadCommands() {
        this.commands = [];
        this.globalCommands = [];
        this.developerCommands = [];
        this.commandCollection.clear();
        this.subcommandCollection.clear();

        fs.readdirSync("./src/autocomplete")
        .filter(file => file.endsWith('.js'))
        .forEach(file => {

         /**
          * @type {Autocompleter}
          */

         const autocompleter = require(`../autocomplete/${file}`);
         this.autocompleteCollection.set(autocompleter.name, autocompleter);
        })

        fs.readdirSync("./src/command")
        .filter(file => file.endsWith(".js"))
        .forEach(file => {

            /**
             * @type {Command}
             */

            const command = require(`../command/${file}`);
            this.commandCollection.set(command.data.name, command);

            if (command.hasSubCommand) {
                if (!fs.existsSync(`./src/command/${command.data.name}`)) {
                    console.error(this.Color.red + `Command ${command.data.name} doesn't have a subcommand directory.` + this.Color.white);
                    return;
                }

                fs.readdirSync(`./src/command/${command.data.name}`)
                .filter(file => file.endsWith(".js"))
                .forEach(file => {

                    /**
                     * @type {Subcommand}
                     */

                    const subcommand = require(`../command/${command.data.name}/${file}`);
                    if (subcommand.group != null) {
                    return this.subcommandCollection.set(command.data.name + "." + subcommand.group + "." + subcommand.name, subcommand);
                    }

                    this.subcommandCollection.set(command.data.name + "." + subcommand.name, subcommand);

                });
            }

            switch(command) {
               case command.isGlobal: this.globalCommands.push(command.data.toJSON());
               case command.isDeveloper: this.developerCommands.push(command.data.toJSON())
               default: this.commands.push(command.data.toJSON()) 
            }

            console.log(this.Color.green + `Command ${command.data.name} was successfully registered!` + this.Color.white);
           });
    
    }

    async loadButtons() {
        this.buttonCollection.clear();

        fs.readdirSync("./src/button")
        .filter(file => file.endsWith(".js"))
        .forEach(file => {

            /**
             * @type {Button}
             */

            const button = require(`../button/${file}`);
            this.buttonCollection.set(button.name, button);
            console.log(this.Color.green + `Button ${button.name} was successfully registered!` + this.Color.white);
        })
    }

    async registerToApi() {

        if (this.globalCommands.length > 0) {
            console.log("Registering global commands to the Discord API...");
            this.rest.put(Routes.applicationCommands(this.user.id),
           { body: this.globalCommands });
           console.log(this.Color.green + `Registered ${this.globalCommands.length} global commands to the Discord API!` + this.Color.white);
           }
    
           if (this.commands.length > 0) {
            let newCommandsCollection = [];
           console.log("Registering guild-exclusive commands to the Discord API...");

           this.guilds.cache.forEach(guild => {
            if (developmentConfig.guilds.includes(guild.id)) {

                newCommandsCollection = this.commands.concat(this.developerCommands);
                this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id),
                { body: newCommandsCollection });

                console.log(
                    this.Color.green + `Registered ${newCommandsCollection.length} commands to guild ${guild.name}`
                     + this.Color.red + ` (DEVELOPER GUILD) ` + this.Color.green + `| ${guild.id}!` + this.Color.white
                     );
                return;
            }
                this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id),
                { body: this.commands });
           console.log(this.Color.green + `Registered ${this.commands.length} commands to guild ${guild.name} | ${guild.id}!` + this.Color.white);
           });
        }
    }

}

module.exports = Client;