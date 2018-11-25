const express = require("express");
const router = express.Router();
const BrainyquotesScrape = require("../models/brainyquoteScrape");
const Quotes = require("../models/quote.js");
const axios = require("axios");

router.get("/brainyquoteScrape", (req, res) => {
  axios
    .get(
      "https://7p7rvvekjb.execute-api.us-west-1.amazonaws.com/default/motivational-scraping?url=https://www.brainyquote.com/topics/family"
    )
    .then(response => {
      let bread = JSON.parse(response.data.body);
      let collectionOfBread = [];
      for (let quoteAndAuthor of bread) {
        let splitBread = quoteAndAuthor.split("-");

        const cleanBread = new Object({
          body: splitBread[0],
          author: splitBread[1],
          friend: "Julaan"
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

module.exports = router;
