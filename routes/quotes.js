const express = require('express');
const router = express.Router();
const Quotes = require('../models/quote.js');

router.get("/quotes", (req, res) => {
    Quotes.find({}, (err, quotes) => {
        if (err) {
            console.log(err);
        } else {
            res.json(quotes);
        }
    });
})

module.exports = router;