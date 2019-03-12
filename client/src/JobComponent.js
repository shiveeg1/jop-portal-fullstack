import React, { Component } from 'react';
import axios from "axios";
const util = require('util');

export class JobComponent extends Component {
    constructor(props) {
        super();
        console.log("job component constructor");
        this.state = {
            joblist : [],
            selectedJobid : 0,
            candList : [],
            interviewList : [],
            searchTerm : '',
            isHidden : true,
            check1 : false,
            check2 : false,
        }
    }

    getJobList = () => {  
        console.log("getting job list");
        let params = {};

        if(!(this.state.check1 && this.state.check2)) {
            if(this.state.check1) {
                params.status = 1
            }
            else {
                params.status = 0
            }
        }

        params.company = this.state.searchTerm;
        console.log(params);
        axios.get("http://localhost:3001/api/getJobs", {params : params})
      .then(res => {
          this.setState({ 
              joblist: res.data.data,
             }); 
          console.log(res.data.data);
          if(this.state.joblist[0] != null) {
            this.getCandList(this.state.joblist[0]['_id']);
          }
          
        });

      this.setState({
        isHidden : false
      });

    }

    getCandList = (jobid, idr) => {
        console.log("getting candidate list for jobid " + jobid);
        axios.get("http://localhost:3001/api/getCandidates/"+jobid)
        .then(res => {
            console.log(res.data);
            this.setState({
                candList : res.data.data,
            });
            if(this.state.candList[0] != null) {
                this.getInterviewList(this.state.candList[0]['_id']);
            }
            
        }
        );
    }

    getInterviewList = (candid) => {
        console.log("getting interview list for candidate id :" + candid);
        
        axios.get("http://localhost:3001/api/getInterviews/"+candid)
        .then(res => {
            console.log(res.data);
            this.setState({interviewList : res.data.data})
        }
        );
    }

    onHandleSearchTermChange = (event) => {
        this.setState({
            searchTerm : event.target.value
        });
    }

    handleCheck1 = () => {
        this.setState({
            check1 : !this.state.check1
        });
    }

    handleCheck2 = () => {
        this.setState({
            check2 : !this.state.check2
        });
    }

    render() {
       
        console.log("came into job portal" );
        let jobcolumns = ['ID','Company','Title','Date Posted', 'Status'];
        let jobtableHeaders = (<thead>
            <tr>
              {jobcolumns.map(function(column, id) {
                return <th key={id}>{column}</th>; })}
            </tr>
        </thead>);
        let jobcolnames = ['_id','company','title','datePosted', 'status'];
        let jobtableBody = this.state.joblist.map((row, idr) => {
            return (
            <tr key={idr}  
                onClick={() => this.getCandList(row['_id'], idr)}>
                {jobcolnames.map(function(column, id) {
                return <td key={id}>{row[column]}</td>; })}
            </tr>); });

        // candidate table vars
        let candCols = ['ID', 'Name', 'WorksAt', 'Exp', 'CTC'];
        let candTableHeaders = (<thead>
            <tr>
                {candCols.map(function(col, id) {
                    return <th key={id}>{col}</th>
                })}
            </tr>
        </thead>);

        let candcolnames = ['_id','name','worksat','exp','ctc'];
        let candTableBody = this.state.candList.map((row, idr) => {
            return (
                <tr key={idr} 
                onClick={() => this.getInterviewList(row['_id'], idr)}>
                {candcolnames.map(function(col, id){
                    return <td key={id}>{row[col]}</td>;
                })}
                </tr>
            )});

            // interview table vars 
            let interCols = ['Round', 'Interviewer', 'Date', 'Result'];
            let interTableHeaders = (<thead>
                <tr>
                    {interCols.map(function(col, id) {
                        return <th key={id}>{col}</th>
                    })}
                </tr>
            </thead>);
            let intercolnames = ['round', 'interviewer', 'date', 'result'];
            let interTableBody = this.state.interviewList.map(function(row, idr) {
                return (
                    <tr key={idr}>
                    {intercolnames.map(function(col, id){
                        return <td key={id}>{row[col]}</td>;
                    })}
                    </tr>
                )});
        return(
            // the consulant id will be passed by the parent as prop

            <div className="container col-xs-20">
                
                <div className="container">
                    <div className="custom-control custom-checkbox mb-3 custom-control-inline">
                    <input type="checkbox" className="custom-control-input" id="customCheck2" onChange={this.handleCheck1} />
                    <label className="custom-control-label " htmlFor="customCheck2">Open</label>        
                    </div>
                    
                    <div className="custom-control custom-checkbox mb-3 custom-control-inline">
                    <input type="checkbox" className="custom-control-input" id="customCheck3" onChange={this.handleCheck2} />
                    <label className="custom-control-label " htmlFor="customCheck3">Closed</label>
                    </div>
                    
                    
                    <div className="custom-control-inline">
                        <input type="text" className="form-control searchbox"
                            value={this.state.searchTerm} 
                            onChange={(event) => {this.onHandleSearchTermChange(event)}}
                            placeholder='Search by company name...' />
                        <button className="btn btn-primary searchbtn" onClick={this.getJobList}>Get a job!</button>
                    </div>
                        
                </div>
                {!this.state.isHidden && <div>
                    <hr/>
                    <div className="container">
                        <table className="table table-bordered table-hover" width="100%">
                            {jobtableHeaders}
                            <tbody>
                            {jobtableBody}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <div className="container candidateTable">
                            <table className="table table-bordered table-hover" width="100%">
                                {candTableHeaders}
                                <tbody>
                                {candTableBody}
                                </tbody>
                            </table>
                        </div>
                        <hr/>
                        <div className="container interviewTable">
                            <table className="table table-bordered table-hover" width="100%">
                                {interTableHeaders}
                                <tbody>
                                {interTableBody}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}
            </div>
           
        );
    }
}