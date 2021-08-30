const BaseEvent = require("../utils/structures/BaseEvent");

class Ready extends BaseEvent {
    constructor() {
        super({
            name: "ready",
            once: false
        })
    }
    /**
     * 
     * @param {import("../utils/structures/AClient.js")} client 
     */
    async execute(client) {
        client.user.setPresence({
            status: "dnd",
            activities: [
                {
                    name: "Application Commands!",
                    type: "COMPETING"
                }
            ]
        })
        return client.log("Ready event successfully running!");
    }
}

module.exports = Ready;