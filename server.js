var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;
// var PORT = 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://<heroku_dqr46ft5>:<bootcamp05>@ds129811.mlab.com:29811/heroku_dqr46ft5";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/week18Populater");

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/articleController.js");

app.use(routes);


app.get("/scrape", function (req, res) {

  axios.get("https://dancingastronaut.com").then(function (response) {

    var $ = cheerio.load(response.data);

    var d =  $("article div.excerpt header").map(
      function (i, element) {
        var result = {};

        result.title = $(this)
          .children("a.fast")
          .children("h3")
          .text();
    
        result.link = $(this)
          .children("a.fast")
          .attr("href");
        result.excerpt = $(this)
          .children("a")
          .children("div.text-excerpt")
          .children("p")
          .text();

        return db.Article.create(result)
      }
    ).get()
    console.log(d)
    Promise.all(d)
    .then(function(data){
      console.log('Scrape complete')
      res.json(data);
    })
    .catch(function(err){
      console.log(err)
      res.send("Error");
    })  
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.delete("/articles", function (req, res) {
  db.Article.deleteMany()
  .then(function(){
    res.json({});
  })
  .catch(function(err){
    console.log(err)
    res.json({});
  })
});

app.get("/saved", function (req, res) {
  db.Article.find({ "saved": true })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return  db.Article.findOneAndUpdate({ "_id": req.params.id }, { saved: true, note: dbNote._id}, {new: true});
    })
    .then(function (dbArticle) {
      console.log(dbArticle)
      res.json(dbArticle);
    })
    .catch(function (err) {
      console.log(err)
      res.json(err);
    });
});

app.post("/saved/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function () {
      return  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false});
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
