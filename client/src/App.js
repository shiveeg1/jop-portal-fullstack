import React, { Component } from 'react';
import NavBar from './NavBar';
import {JobComponent} from './JobComponent';
import {LoginComponent} from './Login';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <div className="col-xs-10 col-xs-offset-1">
            <h1 className="mb-3">Job Portal App</h1>
            <BrowserRouter>
              <Switch>
                <Route path="/portal" component={JobComponent} />
                <Route path="/" exact={true} component={LoginComponent} />
              </Switch>  
            </BrowserRouter>
          </div>
        </div>
      </div>
    );
  }
}

export default App;