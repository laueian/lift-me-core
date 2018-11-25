//Express Setup
const express = require("express");
const app = express();
// Body Parser - Middleware for handling JSON boodies
const bodyParser = require("body-parser");

//Body Parser Setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mongoose Connection Setup
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

// set responses as JSON
app.set("json spaces", 40);

// Include routes
const quoteRoutes = require("./routes/quotes");
const brainyquoteScrapes = require("./routes/brainyquoteScrapes");

// Defining the port on which the server is going to run
const port = process.env.PORT || 8000;

// include routes
app.use("/", quoteRoutes, brainyquoteScrapes);

// Server is started and is listening on the defined port
app.listen(port, () => {
  console.log("We're live on " + port);
});
