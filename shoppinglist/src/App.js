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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AddCircle from '@material-ui/icons/AddCircle';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [{
                id: 1,
                title: "Cheeseburger",
                price: 20,
                description: "Cheeseburger med glacerede lø.."
            }, {
                id: 2,
                title: "Boller i karry",
                price: 50,
                description: "Gammeldags boller i karry"
            }],
            left: false
        };
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    render() {
        const sideList = (
            <div className="list">
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        return (
            <Router>
                <div className="container">
                    <div className="header">
                        <a onClick={this.toggleDrawer('left', true)} href="#">
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
                    <AddCircle className="addIcon"/>
                </div>
            </Router>
        );
    }
}

export default App;