const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');           // Log all HTTP requests to the console
const app = express();
const checkJwt = require('express-jwt');    // Check for access tokens automatically
const mongoose = require('mongoose');

//let dbUrl = 'mongodb+srv://TobiasSecher:rJ.BejAatvzXS4y@cluster0-inrvm.mongodb.net/test?retryWrites=true';
let dbUrl = 'mongodb://localhost/shoppingList';

/****** Configuration *****/
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log('mongo db connection', err);
});

app.use(bodyParser.json());                 // Make sure all json data is parsed
// app.use(morgan('combined'));         // Log all requests to the console

const port = (process.env.PORT || 8080);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log(`db connection is opend`);
})

/*if (!process.env.JWT_SECRET) {
    console.error('You need to put a secret in the JWT_SECRET env variable!');
    process.exit(1);
}*/

/****** Middleware *****/

// Additional headers to avoid triggering CORS security errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});

// Open paths that does not need login
/*let openPaths = [
    '/api/users/authenticate',
    '/api/users/'
];
// Validate the user using authentication
app.use(
    checkJwt({ secret: process.env.JWT_SECRET }).unless({ path : openPaths})
);
app.use((err, req, res) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: err.message });
    }
});*/

let listSchema = new mongoose.Schema({
    title: String,
    description: String,
    items: []
});

let List = mongoose.model('List', listSchema);

/****** Routes ******/
let usersRouter = require('./users_router')();
app.use('/api/users', usersRouter);

let shoppingListsRouter = require('./shoppingLists_router')();
app.use('/api/shoppingLists', shoppingListsRouter);


app.get('/test/', (req, res) => {
    List.find({}, (err, lists) => {res.json(lists)})
    // res.json(list);
})
/****** Error handling ******/
app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500).send({ msg: 'Something broke!' })
});

/****** Listen ******/
app.listen(port, () => console.log(`API running on port ${port}!`));

