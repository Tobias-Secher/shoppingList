import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import React, { Component } from 'react';
import { openDB } from 'idb';


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

const DB_VERSION = 1;
const DB_NAME = 'ShoppingList';
const DB_STORE = 'ShoppingLists';
const DB_REQUEST = 'ShoppingListsRequest';

class App extends Component {
    newId = "0";
    db;
    api_url = process.env.REACT_APP_API_URL;
    SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

    constructor(props) {
        super(props);

        this.state = {
            shoppingLists: [],
            left: false,
            search: false,
            connectivity: true
        };
        this.binds();
    }

    binds() {
        this.addShoppingList = this.addShoppingList.bind(this);
        this.deleteShoppingList = this.deleteShoppingList.bind(this);
        this.getIndexedDB = this.getIndexedDB.bind(this);
        this.createIndexed = this.createIndexed.bind(this);
        this.addOneToIndexedDB = this.addOneToIndexedDB.bind(this);
        this.deleteOneFromIndexedDB = this.deleteOneFromIndexedDB.bind(this);
        this.updateNetworkStatus = this.updateNetworkStatus.bind(this);
    }

    componentDidMount() {
        this.createIndexed();
        if (!navigator.onLine) {
            this.updateNetworkStatus();
            this.getIndexedDB()
        } else {
            this.getShoppingLists()
        }

        window.addEventListener('online', this.updateNetworkStatus, false);
        window.addEventListener('offline', this.updateNetworkStatus, false);
    }

    //To update network status
    updateNetworkStatus() {
        if (navigator.onLine) {
            this.setState({
                connectivity: true
            });
        } else {
            this.setState({
                connectivity: false
            });
        }
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };
    toggleSearch = () => () => {
        this.setState({
            search: !this.state.search
        });
    };

    getShoppingLists() {
        fetch(`${this.api_url}/shoppingLists`)
            .then(response => response.json())
            .then(json => {
                this.addAllToIndexedDB(json);
            })
    }

    createIndexed() {
        // If the database dosen't exist -> create it
        // else -> fetch it.
        let request = indexedDB.open(DB_NAME, DB_VERSION);

        // If the base creation/fetch is successfull
        request.onsuccess = function (event) {
            // Do stuff here
        };

        // If there are errors
        request.onerror = function () {
            console.error('[onerror]', request.error);
        };

        // This only runs when the database version changes.
        // This is to make sure the database updates the structure
        // If needed, everytime there are a version change.
        request.onupgradeneeded = function (event) {
            // Gets the result from the database request
            let db = event.target.result;
            // Creates the object store where we are keeping the lists
            // For offine use
            db.createObjectStore(DB_STORE.toString(), { keyPath: '_id' });
            // Creates the oject store where we are keeping the changes
        };
    }

    async addAllToIndexedDB(json) {
        // Open connection to indexeddb
        let db = await openDB(DB_NAME, DB_VERSION);
        // Creates the transaction and allows it to read and write data
        let transaction = db.transaction(DB_STORE.toString(), 'readwrite');
        // Gets the correct objectStore
        let objectStore = transaction.objectStore(DB_STORE);
        // Adds all the json elements to the objectstore
        objectStore.clear();
        json.forEach(function (list) {
            objectStore.put(list)
        });
        // Update the state
        this.getIndexedDB();
        // Closes the connection
        db.close()
    }

    async addOneToIndexedDB(json) {
        // Open connection to indexeddb
        let db = await openDB(DB_NAME, DB_VERSION);
        // Creates the transaction and allows it to read and write data
        let transaction = db.transaction(DB_STORE.toString(), 'readwrite');
        // Gets the correct objectStore
        let objectStore = transaction.objectStore(DB_STORE);

        let allObjects = await objectStore.getAll();
        
        json._id = this.findNewId(allObjects);
        objectStore.add(json);
        this.getIndexedDB();
        // Closes the connection
        db.close()
    }

    findNewId(arr){
        let id = 0;
        for (let i = 0; i < arr.length; i++) {
            console.log(`Loop id ${arr[i]._id} : id ${id}`)
            if (parseInt(arr[i]._id) >= id) {
                id = parseInt(arr[i]._id) + 1;
                console.log(`Biggest id ${id}`);
            }
        }

        return id.toString();
    }

    async deleteOneFromIndexedDB(id) {
        // Open connection to indexeddb
        let db = await openDB(DB_NAME, DB_VERSION);
        // Creates the transaction and allows it to read and write data
        let transaction = db.transaction(DB_STORE.toString(), 'readwrite');
        // Gets the correct objectStore
        let objectStore = transaction.objectStore(DB_STORE);
        // Adds all the json elements to the objectstore

        objectStore.delete(id);
        this.getIndexedDB();
        // Closes the connection
        db.close()
    }

    async getIndexedDB() {
        // Open connection to indexeddb
        let db = await openDB(DB_NAME, DB_VERSION);
        // Get the transaction and only allows it to read.
        let transaction = db.transaction(DB_STORE.toString(), 'readonly');
        // Gets the correct objectStore
        let objectStore = transaction.objectStore(DB_STORE);
        // Fetches all items in the object store
        let allSavedItems = await objectStore.getAll();
        // Assigns a new id for later use. This is used when adding.
        // if (allSavedItems.length > 0) {
        //     this.newId = (parseInt(allSavedItems[allSavedItems.length - 1]._id) + 1).toString();
        // }
        // let largest = 0;
        // console.log(allSavedItems);
        // for (let i = 0; i < allSavedItems.length; i++) {
        //     console.log(allSavedItems[i]._id)
        //     if (parseInt(allSavedItems[i]._id) > largest){
        //         largest = parseInt(allSavedItems[i]._id) + 1;
        //         console.log(allSavedItems[i]._id);
        //     }
        // }
        // console.log(largest);
        // this.newId = largest.toString();



        // this.newId = `${allSavedItems[allSavedItems.length]._id + 1}`;
        // Updates the react state, in order to display the lists
        this.setState({
            shoppingLists: allSavedItems
        });
        // Closes the connection
        db.close()

    }

    addShoppingList(shoppingList) {
        // console.log("#######################");
        // console.log("KØR POST");
        // console.log("#######################");
        fetch(`${this.api_url}/shoppingLists/`, {
            method: 'POST',
            body: JSON.stringify(shoppingList),
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                let data = {
                    "text": "Din nye liste er blevet synkroniseret med skyen!",
                    "title": "Synkroniseret!"
                };
                fetch(`${this.api_url}/push_message/`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Accept': 'application/json',
                        "Content-type": "application/json; charset=UTF-8"
                    }
                });
            });
        this.addOneToIndexedDB(shoppingList);
    }

    deleteShoppingList(id) {
        fetch(`${this.api_url}/shoppingLists/${id}`, {
            method: 'DELETE',
            body: JSON.stringify(id),

        })
            .then(response => response.json())
            .catch(error => console.error(error));
        this.deleteOneFromIndexedDB(id);
    }

    render() {
        const sideList = (
            <div className="list">
                <div className="loginContainer">
                    <span className="dot" />
                    <h3>coolguy28@gmail.com</h3>
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

        let searchClass = this.state.search ? "openSearch" : "closedSearch";

        let connectClass = this.state.connectivity ? "online" : "offline";

        return (
            <Router>
                <div className="container">
                    <div className={connectClass + ' header'}>
                        <button aria-label="menu button" onClick={this.toggleDrawer('left', true)}>
                            <Menu />
                        </button>
                        <Link to={'/'}><h1>Lists</h1></Link>
                        <input aria-label="search input field" placeholder="search..." type="text" name="searchInput"
                            id="searchInput"
                            className={searchClass} />
                        <button aria-label="toggle searchbar" onClick={this.toggleSearch()}>
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
                                        DB_NAME={DB_NAME}
                                        DB_STORE={DB_STORE} DB_VERSION={DB_VERSION} />}
                            />
                            <Route exact path={'/create'}
                                render={(props) =>
                                    <ShoppingListForm {...props}
                                        addShoppingList={this.addShoppingList} newId={this.newId} />}
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
                    <Link aria-label="create new list" to={'/create'}>
                        <AddCircle className="addIcon" />
                    </Link>
                </div>
            </Router>
        );
    }
}

export default App;