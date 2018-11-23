const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Quotes = require('../models/quote.js');


// List All Quotes
router.get("/quotes", (req,res) => {
    Quotes.find({}, (err,quotes) => {
        if(err){
            console.log(err);
        }else{
            res.json(quotes);
        }
    });
});


// Create A New Quote
router.post("/quotes", (req,res) => {
	Quotes.create(req.body, (err, quote) => {
		if (err){
			console.log(err);
		}else{
			console.log(quote);
			res.send(quote);
		}
	})
});


module.exports = router;