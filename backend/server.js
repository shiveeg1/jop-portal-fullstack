const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const cors = require('cors');
const Job = require('./data/Jobs');
const Candidate = require('./data/Candidate');
const Consultant = require('./data/Consultant');
const Interview = require('./data/Interview');
const btoa = require('btoa');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://shivee:KuXSrt8YuyimUz4L@cluster0-gubmw.mongodb.net/";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true,
    dbName: 'yourDbName' }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// handle login 
router.post("/login",(req, res) => {
  console.log("trying to login");
  const {username, password} = req.body;
  Consultant.find({"username" : username },(err, data) => {
    console.log(username, password, data, btoa(password));
    if(btoa(password) == data[0].password){
      res.json({success : true , redirect : true});
    } 
    else if (err) {
      return res.json({ success: false, error: err , redirect : false});
    } 
    else {
      res.json({ success: false, redirect : false });
    }
  });

})

router.put("/register",(req,res) => {
  let consultant = new Consultant();
  const {_id, username, password } = req.body;
  console.log(req.body, _id, username, password, btoa(password));
  if ((!_id && _id !== 0) || !username || !password) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  consultant._id = _id;
  consultant.username = username;
  consultant.password = btoa(password);

  consultant.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
})

// insert a new job post into the database
router.put("/addJob",(req,res) => {
  let job = new Job();
  console.log('got a job put request');
  const {_id, company, title, dateposted, status, postedByConsultantId} = req.body;

  if ((!_id && _id !== 0) || !company) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  job._id = _id;
  job.company = company;
  job.title = title;
  job.datePosted = new Date(dateposted);
  job.status = status;
  job.postedByConsultantId = postedByConsultantId;

  console.log(job);

  job.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

})

// update an existing job]
router.post("/updateJob",(req,res) => {
  console.log('got a job post request', req.body);
  let update = {};
  
  const {_id, company, title,datePosted,status, postedByConsultantId} = req.body;
  update.company = company;
  update.title = title;
  update.datePosted = datePosted;
  update.status = status;
  update.postedByConsultantId = postedByConsultantId;
  console.log(update);
  if ((!_id && _id !== 0)) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  Job.findOneAndUpdate({"_id": _id}, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

})

// get all job list
router.get("/getJobs", (req, res) => {
  console.log(req.query, req.query['company'], req.query['status']);
  Job.find({company: req.query['company'],status : req.query['status']},(err, data) => {
    console.log(data);
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// delete jobs by ID
router.delete("/deleteJob", (req, res) => {
  const { _id } = req.body;
  Job.deleteMany({"id" : _id}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// =========== CANDIDATE ======================
// insert a new job post into the database
router.put("/addCandidate",(req,res) => {
  let cand = new Candidate();
  console.log('got a job post request');
  const {_id, name, exp, ctc, jobid} = req.body;

  if ((!_id && _id !== 0) || !name) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  cand._id = _id;
  cand.name = name;
  cand.exp = exp;
  cand.ctc = ctc;
  cand.jobid = jobid;

  console.log(cand);

  cand.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

});

// get all candadates for a job
router.get("/getCandidates/:jobid", (req, res) => {
  let jobid = req.params.jobid;
  Candidate.find({"jobid" : jobid },(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// ========== INTERVIEWS ==============
// insert a new job post into the database
router.put("/addInterview",(req,res) => {
  let interview = new Interview();
  console.log('got a job post request');
  const {round, interviewer, date, result, candidate} = req.body;

  if (!round) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  interview.round = round;
  interview.interviewer = interviewer;
  interview.date = new Date(date);
  interview.result = result;
  interview.candidate = candidate;

  console.log(interview);

  interview.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

});

// get the list of all interviews for a candidate
router.get("/getInterviews/:candID", (req, res) => {
  let candID = req.params.candID;
  Interview.find({"candidate" : candID },(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});



// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));