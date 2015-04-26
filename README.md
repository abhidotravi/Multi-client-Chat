# Multi-client-Chat

Here's a simple multi-client chat room implemented in Node.js. The distinguishing feature of this implementation is the integration of Redis for persistent data handling. So when a new person joins the chat room, he / she can see the entire chat history.

###Dependencies for running

- Download and install Redis with the following commands
$ wget http://download.redis.io/releases/redis-3.0.0.tar.gz
$ tar xzf redis-3.0.0.tar.gz
$ cd redis-3.0.0
$ make

Refer to http://redis.io/download for more details

- Once Redis is installed, start the redis server with the following command
$ src/redis-server


- Execute the following commands to run app.js
$ cd multiclientchat
$ sudo node app.js

NOTE: run the following command before starting nodejs:
$ sudo npm install

"redis" package for nodejs is used to connect to redis from nodejs


- Open the browser and connect to http://localhost:3000/

- Enter the name you want to use in the chat room.

- Chat away!


