const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema (
    {
        _id : Number,
        company : String,
        title : String,
        datePosted : Date,
        status : Number,
        postedByConsultantId : Number
    }
);

module.exports = mongoose.model("Job", JobSchema);