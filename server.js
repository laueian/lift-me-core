process.env.ENVIRONMENT = "local";

const https = require("https");
const http = require("http");
const path = require("path");
const fs = require("fs");
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

//Favicon
var favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//Initialize passport
const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

//View Engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// set responses as JSON
app.set("json spaces", 40);

// Include routes
const quoteRoutes = require("./routes/quotes");
const brainyquoteScrapes = require("./routes/brainyquoteScrapes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

// use routes
app.use("/quotes", quoteRoutes);
app.use("/brainyquoteScrape", brainyquoteScrapes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home");
});

// ===========================================
// -------Anything dependent on secrets-------
// ===========================================

const client = require("./services/aws");
const secretName = selectEnvSecret();
const options = certConfig();

function selectEnvSecret() {
  if (process.env.ENVIRONMENT == "local") return "lift-me-core-local";
  else return "lift-me-core-prod";
}

client.getSecretValue({ SecretId: secretName }, (err, data) => {
  if (err) {
    throw err;
  } else {
    if ("SecretString" in data) {
      const secret = data.SecretString;
      process.env.SECRETS = data.SecretString;
    }

    setupPassport();
    cookieSetup();
    connectDatabase();
    startServer();
  }
});

function startServer() {
  const portHttps = process.env.PORT || 3000;

  https.createServer(options, app).listen(portHttps, () => {
    console.log(`We're live on ${portHttps} - HTTPS`);
  });
}

function connectDatabase() {
  const mongoose = require("mongoose");
  const mongoDB = JSON.parse(process.env.SECRETS).dbConnectionString;
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
}

function certConfig() {
  if (process.env.ENVIRONMENT == "local") {
    return {
      key: fs.readFileSync(__dirname + "/cert/localhost-key.pem"),
      cert: fs.readFileSync(__dirname + "/cert/localhost.pem")
    };
  } else {
    return {
      key: fs.readFileSync(__dirname + "/cert/privkey.pem"),
      cert: fs.readFileSync(__dirname + "/cert/fullchain.pem")
    };
  }
}

function cookieSetup() {
  const cookieSession = require("cookie-session");

  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [JSON.parse(process.env.SECRETS).cookieKey]
    })
  );
}

function setupPassport() {
  const passportSetup = require("./services/passport");
}
