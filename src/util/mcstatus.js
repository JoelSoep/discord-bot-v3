const axios = require('axios');

class MCStatusAPI {
    constructor () {
        this.ip = "play.mcmanhunt.com"
        this.baseURL = "https://api.mcstatus.io/v2/";
        this.instance = axios.create({
            baseURL: this.baseURL
        })
    }

    generateJavaStatusPath() {
        return `status/java/${this.ip}`;
    }

    generateJavaWidgetPath() {
        return `widget/java/${this.ip}`;
    }

    generateIconPath() {
        return `icon/${this.ip}`;
    }

    async getJavaStatus() {
        const res = await this.instance.get(this.generateJavaStatusPath());
        return res.data;
    }

    async getOnlineStatus() {
        const data = await this.getJavaStatus();
        return data?.online ?? false;
    }

    getJavaWidget() {
        return this.baseURL + this.generateJavaWidgetPath();
    }
}

module.exports = MCStatusAPI;