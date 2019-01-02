const https = require('https')
const http = require('http')
const path = require('path');
var fs = require('fs')
//Express Setup
const express = require("express");
const app = express();

// Body Parser - Middleware for handling JSON boodies
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Enable CORS
const cors = require("cors");
app.use(cors());


// Env config
//Local Cert
const options = {
  key: fs.readFileSync(__dirname + '/cert/localhost-key.pem'),
  cert: fs.readFileSync(__dirname + '/cert/localhost.pem')
};

// Env config
//Prod Cert
//const options = {
//  key: fs.readFileSync(__dirname + '/cert/privkey.pem'),
//  cert: fs.readFileSync(__dirname + '/cert/fullchain.pem')
//};

//Keys
const Keys = require('./config/keys')

//Passport Setup
const passportSetup = require('./services/passport')

//Initialize passport
const passport = require('passport')

//Cookie session
const cookieSession = require('cookie-session')

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [Keys.session.cookieKey]
}));

app.use(passport.initialize())
app.use(passport.session())

//View Engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// MongoDB Setup
const mongoose = require("mongoose");
const db = require("./config/db");
const mongoDB = db.url;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
let connection = mongoose.connection;
connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// create home route
app.get('/', (req, res) => {
  res.render('home');
});

// set responses as JSON
app.set("json spaces", 40);

// Include routes
const quoteRoutes = require("./routes/quotes");
const brainyquoteScrapes = require("./routes/brainyquoteScrapes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile")

// use routes
app.use("/quotes", quoteRoutes);
app.use("/brainyquoteScrape", brainyquoteScrapes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Defining the port on which the server is going to run
const portHttps = process.env.PORT || 3000;

https.createServer(options, app).listen(portHttps, () => {
  console.log(`We're live on ${portHttps} - HTTPS`);
});