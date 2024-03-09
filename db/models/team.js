const mongoose = require("mongoose");

const team = new mongoose.Schema({
    image:String,
    name:String,
    sports:String,
    location:String,
    phoneno:Number,
    members:[String]
});

const teammodel = new mongoose.model("Teammodel",team);

module.exports = teammodel;