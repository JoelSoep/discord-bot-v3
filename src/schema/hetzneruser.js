const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
    Guild: String,
    UserId: String,
    Organization: String,
    API_Key: String
});

module.exports = mongoose.model('hetzner_auth', Schema, 'hetzner_auth');