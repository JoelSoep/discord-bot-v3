const { SlashCommandBuilder, PermissionFlagsBits, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require("discord.js");
const Command = require("../structure/command.js");
module.exports = new Command({
    isDeveloper: false,
    isGlobal: false,
    hasSubCommand: true
},

new SlashCommandBuilder()
.setName("statuspage")
.setDescription("Manage the Mineworld statuspage via Discord.")
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
.addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
.setName("incident")
.setDescription("Manage the page's incidents.")
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("create")
.setDescription("Creates a new incident for the page.")
.addStringOption(option => option
    .setName("incident_name")
    .setDescription("The name for the incident (max 255 characters).")
    .setRequired(true)
    )
.addStringOption(option => option
    .setName("incident_component")
    .setDescription("The component that is impacted by the incident.")
    .setAutocomplete(true)
    .setRequired(true)
)
.addStringOption(option => option
    .setName("incident_status")
    .setDescription("The status for the incident.")
    .addChoices(
        { name: "Investigating", value: "investigating" },
        { name: "Identified", value: "identified" },
        { name: "Monitoring", value: "monitoring" },
        { name: "Resolved", value: "resolved" }
    )
    .setRequired(true))
.addStringOption(option => option
    .setName("incident_impact")
    .setDescription("The impact the incident has.")
    .setChoices(
        { name: "No impact", value: "none" },
        { name: "Under Maintenance", value: "maintenance" },
        { name: "Minor Impact", value: "minor" },
        { name: "Major Impact", value: "major" },
        { name: "Critical Impact", value: "critical" }
    )
    .setRequired(true)
)
.addStringOption(option => option
    .setName("incident_body")
    .setDescription("The context for the incident.")
    .setRequired(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("delete")
.setDescription("Deletes an incident.")
.addStringOption(option => option
    .setName("incident_id")
    .setDescription("The incident's ID.")
    .setAutocomplete(true)
    .setRequired(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("update")
.setDescription("Update's an incident's status.")
.addStringOption(option => option
    .setName("incident_id")
    .setDescription("The incident to update.")
    .setAutocomplete(true)
    .setRequired(true))
.addStringOption(option => option
    .setName("incident_status")
    .setDescription("The new status.")
    .setRequired(true)
    .addChoices(
        { name: "Investigating", value: "investigating" },
        { name: "Identified", value: "identified" },
        { name: "Monitoring", value: "monitoring" },
        { name: "Resolved", value: "resolved" }
    ))
.addStringOption(option => option
    .setName("incident_impact")
    .setDescription("The impact the incident has.")
    .setChoices(
        { name: "No impact", value: "none" },
        { name: "Under Maintenance", value: "maintenance" },
        { name: "Minor Impact", value: "minor" },
        { name: "Major Impact", value: "major" },
        { name: "Critical Impact", value: "critical" }
    )
    .setRequired(true)
)
.addStringOption(option => option
    .setName("incident_body")
    .setDescription("The incident's body.")
    .setRequired(true)))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("resolve")
.setDescription("Resolves the incident. This also updates the attached component status to OPERATIONAL.")
.addStringOption(option => option
    .setName("incident_id")
    .setDescription("The incident to resolve.")
    .setAutocomplete(true)
    .setRequired(true)
))
)
.addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
.setName("component")
.setDescription("Manage the page's components.")
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("setstate")
.setDescription("Changes the component's state.")
.addStringOption(option => option
    .setName("component_id")
    .setDescription("The component's ID.")
    .setAutocomplete(true)
    .setRequired(true))
.addStringOption(option => option
    .setName("component_status")
    .setDescription("The component's new status.")
    .setRequired(true)
    .addChoices(
        { name: "Operational", value: "operational" },
        { name: "Degraded Performance", value: "degraded_performance" },
        { name: "Partial Outage", value: "partial_outage" },
        { name: "Major Outage", value: "major_outage" },
        { name: "Under Maintenance", value: "under_maintenance" }
    ))))
.addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
.setName("autochannel")
.setDescription("Change whether the channel should act as an auto-statuspage channel.")
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("on")
.setDescription("Registers the current channel to the auto-statuspage list.."))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("off")
.setDescription("Unregisters the current channel from the auto-statuspage list."))
)
.addSubcommandGroup(new SlashCommandSubcommandGroupBuilder()
.setName("manualchannel")
.setDescription("Change whether the channel should act as a manual-statuspage channel.")
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("editdescription")
.setDescription("Edit the description of the embed. \"EMPTY\" resets the description to default.")
.addStringOption(option => option.setRequired(true).setDescription("The description for the embed.").setName("manualchannel_description")))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("on")
.setDescription("Registers the current channel to the manual-statuspage list.."))
.addSubcommand(new SlashCommandSubcommandBuilder()
.setName("off")
.setDescription("Unregisters the current channel from the manual-statuspage list."))
),

async (client, interaction) => {
    interaction.reply({ flags: "Ephemeral", content: "Please select an option." });
}
)