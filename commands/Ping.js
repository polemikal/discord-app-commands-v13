const { SlashCommandBuilder } = require("@discordjs/builders");
const BaseCommand = require("../utils/structures/BaseCommand");

class Ping extends BaseCommand {
    /**
     * 
     * @param {import("../utils/structures/AClient.js")} client 
     */
    constructor() {
        super({
            command: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Ping command."), // This option is included in type 1. You can configure this option directly with the SlashCommandBuilder feature.
            aliases: ["test-ping"], // Application command aliases.
            guildOnly: true // Determines whether your command is only guild.
        });
    }
    /**
     * 
     * @param {import("../utils/structures/AClient.js")} client 
     */
    async onLoad(client) {
        //...
    }
    /**
     * 
     * @param {import("../utils/structures/AClient.js")} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        return interaction.reply({ content: "Pong!", ephemeral: true });
    }
}
module.exports = Ping;