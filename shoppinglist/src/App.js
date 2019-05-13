import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import React, { Component } from 'react';
import { openDB, deleteDB, wrap, unwrap } from 'idb';


import './app.scss';
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
import KeyBoardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ShoppingListFormUpdate from "./shoppingListFormUpdate";

import io from 'socket.io-client';
const DB_VERSION = 3;
const DB_NAME = 'ShoppingList';
const DB_STORE = 'ShoppingLists';
class App extends Component {

    db;
    api_url = process.env.REACT_APP_API_URL
    SOCKET_URL = 'http://localhost:8080/shopping_list';
    constructor(props) {
        super(props);

        this.state = {
            shoppingLists: [],
            left: false,
            search: false
        };

        this.addShoppingList = this.addShoppingList.bind(this);
        this.deleteShoppingList = this.deleteShoppingList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.getIndexedDB = this.getIndexedDB.bind(this);
        this.createIndexed = this.createIndexed.bind(this);
    }

    componentDidMount() {
        this.createIndexed();
        this.getShoppingLists()
        if (!navigator.onLine)
            this.getIndexedDB()
        const socket = io(this.SOCKET_URL);

        socket.on('new-data', (data) => {
            console.log(`server msg: ${data.msg}`);
            this.getShoppingLists();
        });
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    toggleSearch = (open) => () => {
        console.log(open);
        this.setState({
            search: open
        });
    };
    getShoppingLists() {
        if (navigator.onLine)
            fetch(`${this.api_url}/shoppingLists`)
                .then(response => response.json())
                .then(json => {
                    this.addToIndexedDB(json);
                })
    }
    createIndexed() {
        let request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            console.log(`[success]`)
            this.db = event.target.result;
        }
        request.onerror = function (event) {
            console.error('[onerror]', request.error);
        };
        request.onupgradeneeded = function (event) {
            console.log(`[UPGRADE]`)
            let db = event.target.result;
            db.createObjectStore(DB_STORE.toString(), { keyPath: '_id' });
        };
    }
    async addToIndexedDB(json) {
        console.log(`Add data`)
        let db = await openDB(DB_NAME, DB_VERSION)
        let transaction = db.transaction(DB_STORE.toString(), 'readwrite');
        let objectStore = transaction.objectStore(DB_STORE);

        json.forEach(function (list, index) {
            objectStore.put(list)
        })

        this.getIndexedDB();
    }

    async getIndexedDB() {
        console.log(`getIndexedDB`)
        let db = await openDB(DB_NAME, DB_VERSION)

        let transaction = db.transaction(DB_STORE.toString(), 'readwrite');

        let objectStore = transaction.objectStore(DB_STORE);
        let allSavedItems = await objectStore.getAll()

        console.log(allSavedItems)
        this.setState({
            shoppingLists: allSavedItems
        })
        db.close()

    }
    setStuff(json) {
        console.log(json)
    }

    addShoppingList(shoppingList) {
        fetch(`${this.api_url}/shoppingLists`, {
            method: 'POST',
            body: JSON.stringify(shoppingList),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new question:");
                console.log(json);
                /*shoppingList._id = json.id;
                this.setState({
                    shoppingLists: [...this.state.shoppingLists, shoppingList]
                })*/
            });
    }

    deleteShoppingList(id) {

        console.log("vi er inde i delete" + id)

        fetch(`${this.api_url}/shoppingLists/delete/${id}`, {
            method: 'DELETE',
            body: JSON.stringify(id),

        })
            .then(response => response.json())
            .then(json => {
                console.log("delete shoppinglist" + id);

            }).catch(error => console.error(error));
    }

    deleteItem(id) {

        console.log("vi er inde i delete item" + id)

        fetch(`${this.api_url}/shoppingLists/delete/item/${id}`, {
            method: 'DELETE',
            body: JSON.stringify(id),

        })
            .then(response => response.json())
            .then(json => {
                console.log("delete item" + id);

            }).catch(error => console.error(error));

    }

    render() {
        const sideList = (
            <div className="list">
                <div className="loginContainer">
                    <span className="dot" />
                    <h3>coolguy27@gmail.com</h3>
                    <KeyBoardArrowDown className="arrowDownIcon" />
                </div>
                <Divider />
                <List>
                    <Link to={'/'}>
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItem>
                    </Link>
                </List>
            </div>
        );

        return (
            <Router>
                <div className="container">
                    <div className="header">
                        <button onClick={this.toggleDrawer('left', true)}>
                            <Menu />
                        </button>
                        <Link to={'/'}><h1>Lists</h1></Link>
                        <button onClick={this.toggleSearch(true)}>
                            <Search />
                        </button>
                    </div>
                    <div className="content">
                        <Switch>
                            <Route exact path={'/'}
                                render={(props) =>
                                    <ShoppingList {...props}
                                        shoppingLists={this.state.shoppingLists}
                                        deleteShoppingList={this.deleteShoppingList} />}
                            />

                            <Route exact path={'/shoppingList/:id'}
                                render={(props) =>
                                    <ShoppingListForm {...props}
                                    />}
                            />
                            <Route exact path={'/shoppingList/update/:id'}
                                render={(props) =>
                                    <ShoppingListFormUpdate {...props}
                                        deleteItem={this.deleteItem} DB_NAME={DB_NAME} DB_STORE={DB_STORE} DB_VERSION={DB_VERSION} />}
                            />


                            <Route exact path={'/create'}
                                render={(props) =>
                                    <ShoppingListForm {...props}
                                        addShoppingList={this.addShoppingList} />}
                            />

                            <Route component={NotFound} />
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
                        <AddCircle className="addIcon" />
                    </Link>
                </div>
            </Router>
        );
    }
}

export default App;