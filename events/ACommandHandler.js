const BaseEvent = require("../utils/structures/BaseEvent");

class ACommandHandler extends BaseEvent {
    constructor() {
        super({
            name: "interactionCreate",
            once: false
        })
    }
    /**
     * 
     * @param {import("../utils/structures/AClient.js")} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction) {
        if(interaction.type !== "APPLICATION_COMMAND" && !interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if(command.guildOnly == true && !interaction.inGuild()) return;
        command.execute(client, interaction);
    }
}

module.exports = ACommandHandler;