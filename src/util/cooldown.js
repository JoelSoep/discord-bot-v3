const Discord = require("discord.js");

class CooldownUtil {
    
    constructor() {
        this.map = new Discord.Collection();
    }

    async setCooldown(userId) {
        this.map.set(userId, Date.now().valueOf() + 3000);
    }

    async getCooldown(userId) {
        return this.map.get(userId);
    }
}

module.exports = CooldownUtil;