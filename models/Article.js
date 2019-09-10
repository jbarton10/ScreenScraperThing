var mongoose = require("mongoose");

var Schema = mongoose.Schema;



var ArticleSchema = new Schema({

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

var Article = mongoose.model("Article" ,ArticleSchema);

module.exports = Article;