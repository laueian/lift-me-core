const express = require("express");
const router = express.Router();
const Quotes = require("../models/quote.js");


// GET all the quotes
router.get("/quotes", (req, res) => {
  Quotes.find({}, (err, quotes) => {
    if (err) {
      console.log(err);
    } else {
      res.json(quotes);
    }
  });
});

// POST a quote
router.post("/quotes", function(req, res) {
  const quote = new Quotes(req.body);
  quote.save(err => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(quote);
  });
});

// UPDATE a quote
router.put("/quotes/:id", function(req, res) {
  Quotes.findOneAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, quote) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(quote);
    }
  );
});

// DELETE a quote
router.delete("/quotes/:id", function(req, res) {
  Quotes.findByIdAndRemove(req.params.id, (err, quote) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Quote successfully deleted",
      id: quote._id
    };
    return res.status(200).send(response);
  });
});

module.exports = router;
