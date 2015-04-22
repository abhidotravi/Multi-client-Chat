var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = require( 'http' ).createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:"+port);

//app.get('/', function(req, res){
//  res.send('<h1>Hello world</h1>');
//});

var redis = require('redis');
var client = redis.createClient(); //creates a new client 

client.on('connect', function() {
    console.log('connected');
});

//create WebSockets - server object and attach to http server
var sio = require( 'socket.io' ).listen(server);
sio.sockets.on('connection', function(socket){
    console.log('Web client connected');

    socket.on('chat_message', function(data) {
        console.log(data.chat);
        socket.emit('chat-reply',{text: data.chat});
        client.rpush(['myqueue', data.chat], function(err, reply) {
            console.log(reply);
        });
    });

    //Handle Disconnect
    socket.on('disconnect', function() {
        console.log('Web client disconnected');
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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


module.exports = app;