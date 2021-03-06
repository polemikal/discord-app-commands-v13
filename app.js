const { Intents } = require('discord.js');
const { TOKEN, CLIENT_ID, GUILD_ID } = require("./config.json");
const AClient = require('./utils/structures/AClient.js');

(async() => {
    const client = new AClient(CLIENT_ID, TOKEN, Object.keys(Intents.FLAGS));
    await client.loadEvents('../../events');
    await client.loadCommands('../../commands', GUILD_ID)
    await client.connect();
})();
