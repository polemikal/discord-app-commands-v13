class BaseCommand {
    constructor(options) {
        /**
         * @type {import("@discordjs/builders").SlashCommandBuilder | import("discord.js").ApplicationCommandData}
         */
        this.command = options.command;
        /**
         * @type {Array<String>}
         */
        this.aliases = options.aliases;
        /**
         * @type {Boolean}
         */
        this.guildOnly = options.guildOnly;
    }
}

module.exports = BaseCommand;