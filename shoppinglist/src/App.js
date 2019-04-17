import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import React, {Component} from 'react';
import './App.css';
import NotFound from './NotFound';
import ShoppingList from "./ShoppingList";

import Drawer from '@material-ui/core/Drawer';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircle from '@material-ui/icons/AddCircle';
import Menu from '@material-ui/icons/Menu';
import Search from '@material-ui/icons/Search';
import ShoppingListForm from "./ShoppingListForm";
import HomeIcon from '@material-ui/icons/Home';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shoppingLists: [],
            left: false
        };
    }

    componentDidMount() {
        this.getShoppingLists();
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    getShoppingLists() {
        fetch('http://localhost:8080/api/shoppingLists')
            .then(response => response.json())
            .then(json => {
                this.setState({
                    shoppingLists: json
                })
            });
    }

    render() {
        const sideList = (
            <div className="list">
                <List>
                    <Link to={'/'}>
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Home"}/>
                        </ListItem>
                    </Link>
                </List>
                <Divider/>
            </div>
        );

        return (
            <Router>
                <div className="container">
                    <div className="header">
                        <a onClick={this.toggleDrawer('left', true)} href="#">
                            <Menu/>
                        </a>
                        <Link to={'/'}><h1>Lists</h1></Link>
                        <a href="#">
                            <Search/>
                        </a>
                    </div>
                    <div className="content">
                        <Switch>
                            <Route exact path={'/'}
                                   render={(props) =>
                                       <ShoppingList {...props}
                                                     shoppingLists={this.state.shoppingLists}/>}
                            />

                            <Route exact path={'/shoppingList/:id'}
                                   render={(props) =>
                                       <ShoppingListForm {...props}
                                       />}
                            />

                            <Route exact path={'/create'}
                                   render={(props) =>
                                       <ShoppingListForm {...props}
                                       />}
                            />

                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                    <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.toggleDrawer('left', false)}
                            onKeyDown={this.toggleDrawer('left', false)}
                        >
                            {sideList}
                        </div>
                    </Drawer>
                    <Link to={'/create'}>
                        <AddCircle className="addIcon"/>
                    </Link>
                </div>
            </Router>
        );
    }
}

export default App;