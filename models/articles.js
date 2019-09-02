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
    //Possibly include photos...
    // photo: {
    //     type: Image
    // }
})