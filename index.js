var express = require('express');

var app = express();
var cors = require('cors')
var path = require('path');
//Body Parser middleware
var bodyParser = require('body-parser');

var request = require('request');

// var mysql = require('./dbcon.js');

var session = require('express-session');

var router = require('./routes/api/experts-api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlebars middleware
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 3500);

//Allow CORS for testing
app.use(cors())

//init public folder
app.use("/public", express.static('./public/'));
app.use('/searchResults', require('./searchResults.js'));

// specify route path for expert-api
app.use('/api', require('./routes/api/experts-api'));

app.get('/', function(req,res){
    res.render('home');
  });

app.get('/expertDisplay', function(req,res){
  res.render('expertDisplay');
});
// Route for creating a new user account.
app.use('/createProfile', require('./createProfile.js'));

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
