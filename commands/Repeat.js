const { TextChannel } = require("discord.js");
const BaseCommand = require("../utils/structures/BaseCommand");

class Repeat extends BaseCommand {
    /**
     * 
     * @param {import("../utils/structures/AClient.js")} client 
     */
    constructor() {
        super({
            command: {
                name: "repeat", // Application command name.
                type: 3 // Type 3 is USER COMMAND.
            },
            aliases: ["r"], // Application command aliases.
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
     * @param {import("discord.js").ContextMenuInteraction} interaction 
     */
    async execute(client, interaction) {
        const targetChannel = interaction.member.guild.channels.cache.get(interaction.channelId);
        const targetMessage = await targetChannel.messages.fetch(interaction.targetId);
        return interaction.reply({ content: targetMessage.content, ephemeral: false, fetchReply: true }).then(m => setTimeout(() => m.delete(), 5000));
    }
}
module.exports = Repeat;