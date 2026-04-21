const mongoose = require("mongoose");

let Schema = new mongoose.Schema ({
    Host: String,
    Port: String,
    ComponentId: String,
    OfflineState: String
});

module.exports = mongoose.model('pingserver', Schema, 'pingserver');