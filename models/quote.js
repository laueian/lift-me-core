const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Here we are defining what a Quote looks like
// and how it is going to be stored in the Database
const quoteSchema = new Schema(
    {
        body: String,
        title: String,
        author: String
    }
);

// We need to export the model of the quote
// so that other files can have access to it
module.exports = mongoose.model("Quote", quoteSchema);