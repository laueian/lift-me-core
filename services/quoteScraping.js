const axios = require("axios");
const Quote = require("../models/quote.js");

module.exports = scraperConfigData => {
  if (scraperConfigData.scrapedOnce) {
    return console.log("Already scarped once - is on scheduler");
  } else {
    axios
      .get(
        `${JSON.parse(process.env.SECRETS).scraperEndpoint}${
          JSON.parse(process.env.SECRETS).scraperTargetUrl
        }/${scraperConfigData.category}/${scraperConfigData.topic}`
      )
      .then(res => {
        let quotesJSON = JSON.parse(res.data.body);
        let collectionOfQuotes = [];

        for (let quoteAndAuthor of quotesJSON) {
          let parsedJSON = quoteAndAuthor.split("-");

          collectionOfQuotes.push(
            new Quote({
              body: parsedJSON[0],
              author: parsedJSON[1]
            })
          );
        }

        collectionOfQuotes.forEach(quote => {
          Quote.find({ body: quote.body }).then(result => {
            if (result && result != "") {
              return console.log("This data already exists - " + quote._id);
            } else {
              new Quote(quote).save((err, newQuote) => {
                if (err) return console.log(err);
                return console.log("Success - " + newQuote._id);
              });
            }
          });
        });
        console.log(collectionOfQuotes.length + " were found");
      })
      // Need to improve error handling on Lambda end
      .catch(err => {
        console.log(err);
      });
  }
};
