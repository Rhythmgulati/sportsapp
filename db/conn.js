const mongoose = require('mongoose');

mongoose.connect('')
.then(()=>console.log("db connceted"))
.catch(()=>console.log("db conncetion error"));

