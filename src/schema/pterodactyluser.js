const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
    Guild: String,
    UserId: String,
    API_Key: String
});

module.exports = mongoose.model('pterodactyl_auth', Schema, 'pterodactyl_auth');