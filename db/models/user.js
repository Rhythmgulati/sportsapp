const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name:String,
    age:Number,
    sports:[String],
    email:String,
    password:String,
    location:String,
    tokens:[String]
});

const usermodel = new mongoose.model("Usermodel",user);

module.exports = usermodel;