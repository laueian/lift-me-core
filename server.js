process.env.ENVIRONMENT = "local";

const https = require("https");
const http = require("http");
const path = require("path");
var fs = require("fs");
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

//Keys
const Keys = require("./config/keys");

//View Engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// create home route
app.get("/", (req, res) => {
  res.render("home");
});

// set responses as JSON
app.set("json spaces", 40);

// ===========================================
// -------Anything dependent on secrets-------
// ===========================================

const client = require("./services/aws");
const secretName = selectEnvSecret();
function selectEnvSecret() {
  if (process.env.ENVIRONMENT == "local") return "lift-me-core-local";
  else return "lift-me-core-prod";
}

const options = certConfig();
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

client.getSecretValue({ SecretId: secretName }, (err, data) => {
  if (err) {
    throw err;
  } else {
    if ("SecretString" in data) {
      const secret = data.SecretString;
      process.env.SECRETS = data.SecretString;
    }

    setupPassport();
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

function setupPassport() {
  //ORDER MATTERS
  // 1. cookieParser
  // 2. session
  // 3. passport.initialize
  // 4. passport.session
  // 5. app.router

  //Cookie session
  const cookieSession = require("cookie-session");

  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [Keys.session.cookieKey]
    })
  );

  //Initialize passport
  const passport = require("passport");

  app.use(passport.initialize());
  app.use(passport.session());

  //Passport Setup
  const passportSetup = require("./services/passport");

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
}
