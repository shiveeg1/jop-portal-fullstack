const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidateSchema = new Schema (
    {
        _id : Number,
        name : String,
        worksat : String,
        exp : Number,
        ctc : Number,
        jobid : Number,
    }
);

module.exports = mongoose.model("Candidate", CandidateSchema);