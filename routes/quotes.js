const express = require("express");
const router = express.Router();
const Quote = require("../models/quote.js");

// GET all the quotes
router.get("/", (req, res) => {
  Quote.find({}, (err, quotes) => {
    if (err) {
      console.log(err);
    } else {
      res.json(quotes);
    }
  });
});

// POST a quote
router.post("/", function(req, res) {
  Quote.find({ body: req.body.body }).then(result => {
    if (result && result != "") {
      return res.status(200).send("This data already exists!");
    } else {
      new Quote(req.body).save((err, newQuote) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(newQuote);
      });
    }
  });
});

// UPDATE a quote
router.put("/:id", function(req, res) {
  Quote.findOneAndUpdate(
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
router.delete("/:id", function(req, res) {
  Quote.findOneAndRemove(req.params.id, (err, quote) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Quote successfully deleted",
      id: quote._id
    };
    return res.status(200).send(response);
  });
});

module.exports = router;
