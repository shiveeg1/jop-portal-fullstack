const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultantSchema = new Schema ({
    _id : Number,
    username : String,
    password : String 
});

module.exports = mongoose.model("Consultant", ConsultantSchema);