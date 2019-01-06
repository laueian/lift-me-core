const axios = require("axios");
const Quotes = require("../models/quote.js");

module.exports = (category, topic) => {
  axios
    .get(
      `${JSON.parse(process.env.SECRETS).scraperEndpoint}${
        JSON.parse(process.env.SECRETS).scraperTargetUrl
      }/topics/family`
    )
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
    // Need to improve error handling on Lambda end
    .catch(err => {
      console.log(err);
    });
};
