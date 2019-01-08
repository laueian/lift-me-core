const express = require("express");
const router = express.Router();
const BrainyquotesScrape = require("../models/brainyquoteScrape");
const quoteScraper = require("../services/quoteScraping");

// GET all configuration data for scraper url
router.get("/", (req, res) => {
  BrainyquotesScrape.find({}, (err, configData) => {
    if (err) {
      console.log(err);
    } else {
      res.json(configData);
    }
  });
});

// POST configuration data for scraper url
router.post("/config/add", (req, res) => {
  BrainyquotesScrape.find({ topic: req.body.topic }).then(result => {
    if (result && result != "") {
      return res.status(200).send("This data already exists!");
    } else {
      new BrainyquotesScrape({
        category: req.body.category,
        topic: req.body.topic,
        scrapedOnce: false,
        lastScraped: new Date()
      }).save((err, newConfigData) => {
        if (err) return res.status(500).send(err);
        else return res.status(200).send(newConfigData);
      });
    }
  });
});

// To active first time scraping by ID
router.get("/:id", function(req, res) {
  BrainyquotesScrape.findById(req.params.id)
    .then(result => {
      quoteScraper(result);
    })
    .then(
      BrainyquotesScrape.findOneAndUpdate(req.params.id, {
        scrapedOnce: true
      }).then(result => {
        res.status(200).send(result);
      })
    );
});

module.exports = router;
