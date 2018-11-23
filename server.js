//Express Setup
const express = require("express");
const app = express();

// Mongoose Connection Setup
const mongoose = require("mongoose");
const db = require("./config/db");
const mongoDB = db.url;
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, "MongoDB connection error:"));

// configure body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// set responses as JSON
app.set('json spaces', 40);

// Include routes
const quoteRoutes = require("./routes/quotes");

// Defining the port on which the server is going to run
const port = (process.env.PORT || 8000);

// include routes
app.use("/", quoteRoutes);

// Server is started and is listening on the defined port
app.listen(port, () => {
  console.log("We're live on " + port);
})
