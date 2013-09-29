//Patrick And Christine's Wedding App
var config = require('./config/config').config;
var express = require('express');
var http = require('http');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var passport = require('passport');
var MongoStore = require('connect-mongo')(express);

mongo.connect(config.mongoURI, function(err, db){
  if (err) throw err;

  var passportConfig = require('./config/passport')(passport, db);
  var app = express();
  var server = http.createServer(app);
  var io = require('socket.io').listen(server);

  io.set('log level', 1);

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.cookieSecret,
    store: new MongoStore({
      db: db
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if (process.env.NODE_ENV !== 'production') {
    config.hostAddress = 'http://localhost:3000'
    app.use(express.errorHandler());
  }

  var routes = require('./routes/routes')(app, db, passport);

  app.locals({
    hostAddress: config.hostAddress
  });

  server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

});  
