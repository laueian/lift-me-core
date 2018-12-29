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
const port = process.env.PORT || 8000;

// Server is started and is listening on the defined port
app.listen(port, () => {
  console.log("We're live on " + port);
});
