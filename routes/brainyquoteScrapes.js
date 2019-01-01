const express = require("express");
const router = express.Router();
const BrainyquotesScrape = require("../models/brainyquoteScrape");

// POST configuration data for scraper url
router.get("/config/add", (req, res) => {
  BrainyquotesScrape.find({ topic: req.body.topic })
    .then((result) => {
      if (result && result != '') {
        return res.status(200).send('This data already exists!');
      } else {
        new BrainyquotesScrape(req.body).
          save((err, newConfigData) => {
            if (err)
              return res.status(500).send(err);
            else
              return res.status(200).send(newConfigData);
          });
      }
    });
});

module.exports = router;
