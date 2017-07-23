const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');
const config = require('./config/database');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

// Database connection
const mongoose = require('mongoose');
mongoose.connect(config.database);
let db = mongoose.connection;

  // Check connection
  db.once('open', function(){
    console.log('Connected to database');
  });

  // Check for db errors
  db.on('error', function(){
    console.log(err);
  });

// Bring in models from db
let Item = require('./models/item');

// App engine settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body-Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Session Middleware
app.use(session({
 secret: 'keyboard cat',
 resave: true,
 saveUninitialized: true,
 store: new MongoStore({ mongooseConnection: mongoose.connection}),
 cookie: {maxAge: 180 * 60 * 1000} // 3h = 180 min
}));

// Express Validation Middleware
app.use(expressValidator({
 errorFormatter: function(param, msg, value) {
     var namespace = param.split('.')
     , root    = namespace.shift()
     , formParam = root;
 
   while(namespace.length) {
     formParam += '[' + namespace.shift() + ']';
   }
   return {
     param : formParam,
     msg   : msg,
     value : value
   };
 }
}));

// Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
 
app.get('*', function(req, res, next){
   res.locals.user = req.user || null;
   res.locals.session = req.session;
   next();
});


// Index route
app.get('/', function(req, res){
  res.render('index');
});

// Route files
let items = require('./routes/items');
app.use('/items', items);
let users = require('./routes/users');
app.use('/users', users);
let clients = require('./routes/clients');
app.use('/clients', clients)

// Start server
app.listen(port, function(){
  console.log('Server started and working on port ' + port);
})