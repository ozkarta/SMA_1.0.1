var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//_______________REQUIRES__________________
var config=require('./config/server')();
var session=require('express-session');
var expressLayouts=require('express-ejs-layouts');
var expressPartials=require('express-partials');
var fs=require('fs');
var xmlObject=require('xml2js');
var multer = require('multer');
var utf8=require('utf8');
var sql=require('mssql');
var passport=require('passport');
var flash=require('connect-flash');
//-------------------CUSTOM-----------------
var defaultRouting=require('./routes/defaultRouting');
var db=require('./models/dbConnector.js');
var smaConfigParser=require('./models/smaConfigParser');
var sma=require('./models/smaLocals.js');


var dbConnector=new db.dbConnector(sql);
var smaLocals=new sma.smaLocals(dbConnector)
var configReader=new smaConfigParser.configReader(sma,app,smaLocals,fs,dbConnector,xmlObject,utf8);
var registerRoutings=new defaultRouting.registerRoutings(sma,smaLocals,passport);


//__________________________________________












// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(expressPartials())
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

*/

app.listen(config.port, function(){
    console.log('Express server listening on port ' + config.port);
});


//_________________________________________________________________
function main(){
  console.dir(sma)
  configReader.parseConfig(function(){
    console.log('triing to register routes .....')
    registerRoutings.register(app,smaLocals,function(){
      setLayout(smaLocals.activeUser.layoutName);
      console.log('trying to set layout ')
      //require('./server_scripts/authentication.js')(passport,sma,smaLocals);
    });
  });

  
  
};


function setLayout(layoutName){
  app.set('layout','layouts/'+layoutName);
  console.log('this was layout ------>'+layoutName)
}

main();




//_________________________________________________________________
console.log('______server was compiled succesfully_______')
//module.exports = app;
