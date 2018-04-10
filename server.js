// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Require Moment
var moment = require('moment');
// Require Mongoose
var mongoose = require('mongoose');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quotes');
var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String,
    created_at: String
    })
    mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'Quote'
    var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'Quote'
    // Use native promises
    mongoose.Promise = global.Promise;
// Routes
// Root Request
app.get('/', function(req, res) {
  res.render('index');
});
// Add User Request 
app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var data = req.body;
    var now = moment().format('h:mm:ss a, MMMM Do YYYY');
    // create a new User with the name and age corresponding to those from req.body
    var quote = new Quote({name: data.name, quote: data.quote, created_at: now });
    console.log(quote);
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    quote.save(function(err) {
      // if there is an error console.log that something went wrong!
      if(err) {
        console.log('something went wrong with save');
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a quote!');
        res.redirect('/quotes');
      }
    })
  })
  app.get('/quotes', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Quote.find({}, function(err, quotes) {
        console.log(quotes);
        // This is the method that finds all of the users from the database
        // Notice how the first parameter is the options for what to find and the second is the
        //   callback function that has an error (if any) and all of the users
        if(err) {
            console.log('something went wrong with the find');
            res.render('index');
          } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully pulled our quotes!');
            res.render('quotes', {quotes: quotes});
          };
        // Keep in mind that everything you want to do AFTER you get the users from the database must
        //   happen inside of this callback for it to be synchronous 
        // Make sure you handle the case when there is an error, as well as the case when there is no error
    });
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
