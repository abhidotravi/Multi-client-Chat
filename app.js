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


var redis = require('redis');
var redis_client = redis.createClient(); //Create a new Redis Client 

//Create a list and push Welcome User.
//This will also ensure that a queue exists during login
redis_client.rpush(['myqueue', "Welcome User"], function(err, reply) {
    console.log(reply);
});

//Data structure to keep track of users of clients connected
var client_sockets = {};

redis_client.on('connect', function() {
    console.log('connected');
});

//create WebSockets - server object and attach to http server
var sio = require( 'socket.io' ).listen(server);

//On client connection
sio.sockets.on('connection', function(socket){
    console.log('Web client connected');

    //On receiving the login information from 
    socket.on('login_message', function(data) {

        //Store user information for that particular client
        client_sockets[socket.id] = data.user;
        console.log("Received: "+socket.id+" -> "+client_sockets[socket.id]);

        //Obtain all the messages stored in redis
        //Display the conversations that have been  stored so far
        redis_client.lrange('myqueue',0,-1,function(err, reply) {
            reply.forEach(function(item){
                socket.emit('server_reply', {text: item});  
            });
        });

    });

    //On receiving chat message from client, do the following:
    //Broadcast to all clients and store the message in Redis
    socket.on('chat_message', function(data) {
        var chat = data.chat;
        var user = client_sockets[socket.id];
        var userChat = " "+user+": "+chat;
        sio.sockets.emit('server_reply', {text: userChat});

        redis_client.rpush(['myqueue', userChat], function(err, reply) {
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
