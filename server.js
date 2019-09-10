var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = process.env.PORT ||3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/assignment13DB";


//Not sure, but I think there is something wrong with mongoose?
mongoose.connect(MONGODB_URI);


// Routes
app.get("/", function(req,res){
  db.Article.find({}).then(function(data){
  
    if (data.length <= 0){
      scrape(function(data2){
        res.render("index", {articles: data2})
      });
     
    }
    else{
      res.render("index", {articles: data})
    }

  });
});

// Route for retrieving all Notes from the db
app.get("/notes", function(req, res) {
  // Find all Notes
  db.Note.find({})
    .then(function(dbNote) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for retrieving all Users from the db
app.get("/user", function(req, res) {
  // Find all Users
  db.User.find({})
    .then(function(articles) {
      // If all Users are successfully found, send them back to the client
      res.json(articles);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for saving a new Note to the db and associating it with a User
app.post("/submit", function(req, res) {
  // Create a new Note in the db
  db.Articles.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbUser) {
      // If the User was updated successfully, send it back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


function scrape(cb){
 
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.pcgamer.com/news/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $("article").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element

      // Not working so far;
      var image = $(element).find("img").attr("data-src");
      //Link for each of the articles
      var link = $(element).parent("a").attr("href");
      //Header for each of the articles
      var header = $(element).find(".article-name").text();
      //Summary for each of the articles
      var summary = $(element).find(".synopsis").text().trim();
      // console.log("-" + header);
      // console.log("-" + summary);
      // console.log("-" + link);
      // console.log("-" + image);
      // console.log("-------------------------------");
     
   
      // console.log('----------------------------------------------')
      // console.log('DB', db);
      // console.log('----------------------------------------------')
  
      // If this found element had both a title and a link
      if (image && link && header && summary) {
        // Insert the data in the scrapedData db
        db.Article.create({
          photo: image,
          url: link,
          headline: header,
          summary: summary
        },
        function(err, inserted) {
          if (err) {
            console.log(err)
            // Log the error if one is encountered during the query
            console.log("this shit isnt working");
          }
          else {
            // Otherwise, log the inserted data
            // console.log(inserted);
            
          }
        });
      }
    });
    cb(inserted);
  });


};

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
