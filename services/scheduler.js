const cron = require("node-cron");
const quoteScraper = require("./quoteScraping");
const BrainyquotesScrape = require("../models/brainyquoteScrape");

//Schedule scraping - Every day at 12:00am
cron.schedule("0 0 0 * * *", () => {
  console.log("Running cron job for scraper");
  let nextToScrape;
  BrainyquotesScrape.find({}, (err, configData) => {
    if (err) {
      console.log(err);
    } else {
      let leastDate = new Date();
      configData.forEach(item => {
        if (leastDate > Date.parse(item.lastScraped)) {
          leastDate = Date.parse(item.lastScraped);
          nextToScrape = item;
        }
      });
    }
  }).then(res => {
    quoteScraper(nextToScrape);
  });
});
