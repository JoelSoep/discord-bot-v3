const { SlashCommandBuilder, PermissionsBitField, GuildTextBasedChannel } = require("discord.js")
const Command = require("../structure/command.js");

module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: false
},

new SlashCommandBuilder()
.setName("tescalate")
.setDescription("Escalates the current ticket to higher staff.")
.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

async (client, interaction) => {
        /** @type {GuildTextBasedChannel} */const channel = interaction.channel;
        const BASE_TICKET_CATEGORY_ID = "817879506182078547";
        const BUG_TICKET_CATEGORY_ID = "936744472455290880";
        const BAN_TICKET_CATEGORY_ID = "854713762090319912";
        const ADMIN_TICKET_CATEGORY_ID = "850484912795942972";

        const ADMIN_ROLE_ID = "793208287772409897";
        const SVR_ROLE_ID = "912283156709785650";

        const MOD_ROLE_ID = "755566518741237820";
        const SR_MOD_ROLE_ID = "1004527756836618250";
        const TRIAL_MOD_ROLE_ID = "755870574051590245";

        const roleArray = [MOD_ROLE_ID, SR_MOD_ROLE_ID, TRIAL_MOD_ROLE_ID];

        if (channel.parent.id !== BASE_TICKET_CATEGORY_ID && channel.parent.id !== BUG_TICKET_CATEGORY_ID && channel.parent.id !== BAN_TICKET_CATEGORY_ID) {
            return interaction.reply({ flags: "Ephemeral", content: "This ticket is not in a ticket category!" });
        }

        if (channel.parent.id == ADMIN_TICKET_CATEGORY_ID) {
            return interaction.reply({ flags: "Ephemeral", content: "This ticket has already been escalated!" });
        }

        channel.setParent(ADMIN_TICKET_CATEGORY_ID);
        channel.send("This ticket has been escalated, please remain patient.");
        interaction.reply({ flags: "Ephemeral", content: "Tescalation was succesful."});
        channel.send(`<@&${ADMIN_ROLE_ID}> <@&${SVR_ROLE_ID}>`).then(message => message.delete());

        try {
            roleArray.forEach(id => channel.permissionOverwrites.create(interaction.guild.roles.cache.get(id), { SendMessages: false }));
        } catch {}
});