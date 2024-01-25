const express = require("express");
const path = require('path');
const routes = require("./routes/main.js");
const expressSession = require("express-session");
const passport = require("passport");
const userModel = require("./models/users.js");
const app = express();
const flash = require('connect-flash');

// set express session
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hey hey hey",
}));

app.use(flash());

// midleWare for initialize passport
app.use(passport.initialize());
app.use(passport.session());

// serialize and deserialize user information
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//this will handeled data and parse data make available in req.body when form is submitted
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
// Set view engine to ejs
app.set('view engine', 'ejs');

// Set path for views folder
app.set('views', path.join(__dirname, 'views'));

// set /ADMotors/... routes to routes folder main file
app.use('/', routes);

//constructs path to 'public' folder. __dirname represents the current working directory, and path.join is used to concatenate the current directory with the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

app.listen(5000, () => {
    console.log("server is working");
})