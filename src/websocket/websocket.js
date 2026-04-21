const Client = require ("../structure/client.js");
const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path")

class Websocket {

    /**
     * @param {Client} client
     */

constructor (client) {

    const limiter = rateLimit.rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        statusCode: 429
    })

app.use(limiter);
console.log(path.join(__dirname, 'img'))
app.use('/cdn', express.static(path.join(__dirname, 'img')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/discord/ping', (req, res) => {
    let ping = client.ws.ping;
    if (!ping) ping = "No data found.";
    res.send(client.ws.ping.toString())
})

app.get('/status/embed', (req, res) => {
    res.send('<script src="https://mcmanhunt1.statuspage.io/embed/script.js"></script>');
})

server.listen(80, () => {
    console.log('Listening on *:80');
});

}

}

module.exports = Websocket