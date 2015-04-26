# Multi-client-Chat

Here's a simple multi-client chat room implemented in Node.js. The distinguishing feature of this implementation is the integration of Redis for persistent data handling. So when a new person joins the chat room, he / she can see the entire chat history.

###Instructions for running

STEP 0: Extract the file "multiclientchat.tar.gz"

STEP 1: Copy the folder "multiclientchat" to $HOME directory of 64bit Ubuntu Virtual machine
that has the required setup for running nodejs.
(Refer to the tutorial1 documentation required for setting up nodejs, npm, bower_components)

STEP 2: Download and install Redis with the following commands
$ wget http://download.redis.io/releases/redis-3.0.0.tar.gz
$ tar xzf redis-3.0.0.tar.gz
$ cd redis-3.0.0
$ make

Refer to http://redis.io/download for more details

STEP 3: Once Redis is installed, start the redis server with the following command
$ src/redis-server


STEP 4: Execute the following commands to run app.js
$ cd multiclientchat
$ sudo node app.js

NOTE: most of the dependency packages are included in the submission but in case something is missed please run the following:
$ sudo npm install

"redis" package for nodejs is used to connect to redis from nodejs


STEP 5: Open the browser "Mozilla Firefox" and connect to http://localhost:3000/

STEP 6: Enter the name you want to use in the chat room.

STEP 7: Open another tab and repeat steps 5 and 6.

STEP 8: Chat away!

###Implementation Details


1. app.js - Server side implementation

- a HTTP server is created that listens to request on port 3000.
- a Websocket is created and the socket listens to anything coming to this server.
- a connection to Redis is made and a list is created
- only on establishing a connection with a client, the server will be able to handle requests from client.
- When user logs in to the chat room with a username, the username is received at the server and stored.
- Every chat message is received at the server and the server performs the following tasks once a chat message is received
	- Identify the username based on the socket ID 
	- Prepend the username to the chat message
	- Broadcast the message to all connected clients
	- Store the message in Redis 

2. ./public/javascripts/client.socket.io.js - Client Side implementation

- The client connects to server "http://127.0.0.1:3000/"
- The client emits the user login information to the server
- The client also emits the chat message keyed in by the user.
- $('#bt-send') represents a  button, when clicked will trigger client to send the chat to server
- $('#bt-login') represents a  button, when clicked will trigger client to send the username to server


3. ./views/index.jade  ./views/layout.jade and ./public/stylesheets/style.css

- The implementation of front-end has been implemented in these 3 files.

4. ./package.json

- a list of dependency packages installed

