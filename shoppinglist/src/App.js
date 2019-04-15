import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import React, { Component } from 'react';
import './App.css';
import NotFound from './NotFound';

class App extends Component {
  render() {
    return (
        <Router>
            <div className="container">
                <Link to={`/`}><h1>Shopping List</h1></Link>
            </div>
            <Switch>


                <Route component={NotFound}/>
            </Switch>
        </Router>
    );
  }
}

export default App;
