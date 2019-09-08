var mongoose = require("mongoose");

var Schema = mongoose.Schema;



var Article = new Schema({

    headline: {
        type: String
    },
    summary: {
        type: String
    },
    url: {
        type: String
    },
    photo: {
        type: String
    }
})

var ArticleToAdd = mongoose.model("Article", Article);

module.exports = ArticleToAdd;