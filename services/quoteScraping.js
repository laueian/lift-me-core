const axios = require("axios");
const Quotes = require("../models/quote.js");

const scraper = require("../config/scraper");

axios
  .get(`${scraper.url}${scraper.targetWebsiteUrl}/topics/family`)
  .then(response => {
    console.log(response);

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
    console.log("Bread acquired");
  })
  // Need to improve error handling on Lambda end
  .catch(err => {
    console.log(err);
  });
