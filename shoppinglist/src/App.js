import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import React, {Component} from 'react';
import './App.css';
import NotFound from './NotFound';
import ShoppingList from "./ShoppingList";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [{
                id: 1,
                title: "Cheeseburger",
                price: 20,
                description: "Cheeseburger med glacerede løg og cheddar"
            }, {
                id: 2,
                title: "Boller i karry",
                price: 50,
                description: "Gammeldags boller i karry"
            }]
        };
    }

    render() {
        return (
            <Router>
                <div className="container">
                    <div className="header">
                        <a href="#">
                            <i className="material-icons">
                                menu
                            </i>
                        </a>
                        <h1>Lists</h1>
                        <a href="#">
                            <i className="material-icons">
                                search
                            </i>
                        </a>
                    </div>
                    <div className="content">
                        <Switch>
                            <Route exact path={'/'}
                                   render={(props) =>
                                       <ShoppingList {...props}
                                                     items={this.state.items}/>}
                            />

                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
