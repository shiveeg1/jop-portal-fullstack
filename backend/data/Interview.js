const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterviewSchema = new Schema (
    {
        round : String,
        interviewer : String,
        date : Date,
        result : String,
        candidate : Number
    }
);

module.exports = mongoose.model("Interview", InterviewSchema);