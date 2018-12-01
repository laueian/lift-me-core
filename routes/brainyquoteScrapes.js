const express = require("express");
const router = express.Router();
const BrainyquotesScrape = require("../models/brainyquoteScrape");
const Quotes = require("../models/quote.js");
const axios = require("axios");

const scraper = require("../config/scraper");

router.get("/brainyquoteScrape", (req, res) => {
  axios
    .get(`${scraper.url}${scraper.targetWebsiteUrl}/topics/family`)
    .then(response => {
      let bread = JSON.parse(response.data.body);
      let collectionOfBread = [];
      for (let quoteAndAuthor of bread) {
        let splitBread = quoteAndAuthor.split("-");

        const cleanBread = new Object({
          body: splitBread[0],
          author: splitBread[1]
        });
        collectionOfBread.push(cleanBread);
      }

      Quotes.insertMany(collectionOfBread, {
        writeConcern: Quotes,
        ordered: false
      });
      res.send("Bread acquired");
    })
    .catch(err => {
      res.send(err);
    });
});

router;

module.exports = router;
