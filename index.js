var express = require('express');
var db_interface = require('./database/db_interface')
var app = express();
var cors = require('cors')
var path = require('path');
const os = require('os');
//Body Parser middleware
var bodyParser = require('body-parser');

var request = require('request');

// var mysql = require('./dbcon.js');

var session = require('express-session');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlebars middleware
var handlebars = require('express-handlebars');

//Custome handlebars helpers
//See https://www.npmjs.com/package/express-handlebars
var hbs = handlebars.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      ifEquals: function(arg1, arg2, options) {
        // console.log("Testing ", arg1, " == ", arg2, ": ", arg1 == arg2)
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
  }
});
app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);

// app.set('views', path.join(__dirname, 'views'))

app.set('port', 3500);

//Allow CORS for testing
app.use(cors())

//init public folder
app.use("/public", express.static('./public/'));
app.use('/searchResults', require('./routes/searchResults.js'));

// specify route path for expert-api

app.get('/', function(req,res){
  var context = {
    jsscripts: [    
      "getKeyword.js"
    ]
  };
    res.render('home', context);
  });

app.get('/expertDisplay', function(req,res){
  res.render('expertDisplay');
});
// Route for creating a new user account.
app.use('/createProfile', require('./routes/createProfile.js'));
app.use('/suggestions', require('./routes/suggestions.js'));
app.use('/activateProfile', require('./routes/activateProfile.js'));
var expertSearch = require('./routes/expertSearch.js');
app.use('/expertSearch', expertSearch);

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
  console.log(`Express started on http://${os.hostname()}:` + app.get('port') + '; press Ctrl-C to terminate.');
});
