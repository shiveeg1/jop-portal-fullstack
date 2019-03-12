import React, { Component } from 'react';
import {Redirect, BrowserRouter, Route, Switch} from 'react-router-dom';
import axios from "axios";
import { JobComponent } from './JobComponent';

export class LoginComponent extends Component {
    constructor(props) {
        super();
        console.log("login constuctor");
        this.state = {
            isLoggedIn : false,
            username : '',
            password : '',
            redirect : false
        }
    }

    handleUserIDChange = (event) => {
        this.setState({
            username : event.target.value
        });
    }

    handlePasswordChange = (event) => {
        this.setState({
            password : event.target.value
        });
    }

    handleLogin = () => {
        console.log("trying to login");
        axios.post("http://localhost:3001/api/login", {
            username : this.state.username,
            password : this.state.password
        })
        .then((res) => {
            console.log(res.data.redirect);
            if(res.data.redirect === true) {
                
                this.setState({
                    redirect : true
                });
            }
            else {
                // just display a msg saying your login failed
            }
        })
        .catch((error) => {
            console.log("some went wrong in logging " + error);
        });
    }

    render() {
        if(this.state.redirect) {
            console.log("redirecting to portal");
             window.location = '/portal';
             return;
        }
        else {
            return(
                <BrowserRouter>
                    <Switch>
                        <Route path="/portal" component={JobComponent} />
                        <Route path="/" render= {() => {
                            return (
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                                            <div className="card card-signin my-5">
                                                <div className="card-body">
                                                    <h5 className="card-title text-center">Sign In</h5>
                                                        <form className="form-signin">
                                                            <div className="form-label-group">
                                                                <input type="text" id="inputEmail" className="form-control" placeholder="Username"
                                                                    onChange={(event) => {this.handleUserIDChange(event)}}
                                                                    value={this.state.username}
                                                                    required autoFocus />
                                                                <label htmlFor="inputEmail">Username</label>
                                                            </div>
                    
                                                            <div className="form-label-group">
                                                                <input type="password" id="inputPassword" className="form-control" placeholder="Password"
                                                                    onChange={(event) => {this.handlePasswordChange(event)}}
                                                                    value={this.state.password}
                                                                    required />
                                                                <label htmlFor="inputPassword">Password</label>
                                                            </div>
                    
                                                            <div className="custom-control custom-checkbox mb-3">
                                                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                                                <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                                                            </div>
                                                            <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit" onClick={this.handleLogin}>Sign in</button>
                                                        </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }} />
                    </Switch>
                </BrowserRouter>
            );
        }
        
    }
}