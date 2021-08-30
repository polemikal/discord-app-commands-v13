const { Client, Collection } = require("discord.js");
const BaseEvent = require("./BaseEvent.js");
const BaseCommand = require("./BaseCommand.js");
const path = require('path');
const fs = require('fs').promises;
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

class AClient extends Client {
    /**
     * 
     * @param {String} user_id 
     * @param {String} bot_token 
     */
    constructor(user_id, bot_token) {
        super({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "DIRECT_MESSAGES"], allowedMentions: { parse: ["everyone", "roles", "users"] }});
        this.user_id = user_id;
        this.bot_token = bot_token;
        this.commands = new Collection();
        this.log = (content) => {
            return console.log(`[${bot_token.substring(Math.floor(bot_token.length / 2))}] ${content}`);
        }
        this.error = (content) => {
            return console.error(`[${bot_token.substring(Math.floor(bot_token.length / 2))}] ERR! ${content}`);
        }
    }
    async connect() {
        await this.login(this.bot_token)
            .then(() => {
                this.log("Successfully connected to \'" + this.user.username + "\' Voice client!")
                return this;
            })
            .catch((err) => {
                this.error("Cannot connect to client: " + err.message);
                return this.destroy();
            });
    }
    /**
     * 
     * @param {String} dir 
     * @param {String} guild_id 
     * @returns 
     */
     async loadCommands(dir = '', guild_id) {
        const filePath = path.join(__dirname, dir);
        const files = await fs.readdir(filePath);
        const rest = new REST({ version: '9' }).setToken(this.bot_token);
        const commands = [];
        const guild_commands = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const stat = await fs.lstat(path.join(filePath, file));
            if (stat.isDirectory()) this.loadCommands(this, path.join(dir, file));
            if (file.endsWith('.js')) {
                const Command = require(path.join(filePath, file));
                if (Command.prototype instanceof BaseCommand) {
                    const command = new Command(); 
                    this.commands.set(command.command.name, command);
                    const aliases = [];
                    if (command.aliases && Array.isArray(command.aliases) && command.aliases.length > 0) {
                        command.aliases.forEach((alias) => {
                            const command_alias = command.command instanceof SlashCommandBuilder ? { ...command.command.toJSON() } : { ...command.command };
                            command_alias.name = alias;
                            aliases.push(command_alias);
                            this.commands.set(alias, command);
                        });
                    }
                    if(command.guildOnly) guild_commands.push(command.command instanceof SlashCommandBuilder ? command.command.toJSON() : command.command, ...aliases);
                    else commands.push(command.command instanceof SlashCommandBuilder ? command.command.toJSON() : command.command, ...aliases);
                    if (command.onLoad || typeof command.onLoad === "function") await command.onLoad(this);
                    this.log(`✅ Successfully loaded \'${file}\' command file. (Command: ${command.command.name})`);
                }
            }
        }
        try {
            if (guild_id && guild_id.length) {
                 await rest.put(
                     Routes.applicationGuildCommands(this.user_id, guild_id),
                     { body: guild_commands },
                 );
            } 
            await rest.put(
                Routes.applicationCommands(this.user_id),
                { body: commands },
            );
            this.log("✅ Successfully registered application commands.");
        } catch (err) {
            this.error("Cannot load commands: "+err.message);
        }
     }
    /**
     * 
     * @param {String} dir 
     * @returns 
     */
    async loadEvents(dir = '') {
         const filePath = path.join(__dirname, dir);
         const files = await fs.readdir(filePath);
         for (let index = 0; index < files.length; index++) {
             const file = files[index];
             const stat = await fs.lstat(path.join(filePath, file));
             if (stat.isDirectory()) this.loadEvents(this, path.join(dir, file));
             if (file.endsWith('.js')) {
                 const Event = require(path.join(filePath, file));
                 if (Event.prototype instanceof BaseEvent) {
                     const event = new Event();
                     if (!event.name || !event.name.length) return this.error(`Cannot load \'${file}\' event file: Event name is not set!`);
                     if (event.once) this.once(event.name, event.execute.bind(event, this));
                     else this.on(event.name, event.execute.bind(event, this));
                     this.log(`✅ Successfully loaded \'${file}\' event file. (Event: ${event.name})`);
                 }
             }
         }
     }
}

module.exports = AClient;