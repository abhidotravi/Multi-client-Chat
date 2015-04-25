var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);

var messages = $('#messages'); //list to display chats
console.log('Client: Connecting to server '+server_name);

//In the beginning display only user login stuff, hide everything else
$(document).ready(function() {
    $("#user_div").show();
    $("#username").focus();
    $("#chat_window").hide();
    $("#chat_message").hide();
});

//Handle clicks on "Login" button
$('#bt-login').click(sendLogin);

//Handle clicks on "Send" button
$('#bt-send').click(sendChat);

//Handle any type of response from server
server.on('server_reply', function(data) {
    console.log('Client: Received message from server: '+data.text);
   	messages.append('<li>'+data.text+'</li>');
});


//Capture the "Enter" key press
$("#username").keypress(function(e) {
   if(e.which === 13) {
       $('#bt-login').click();
   }
});

//Capture the "Enter" key press
$("#chat").keypress(function(e) {
   if(e.which === 13) {
       $('#bt-send').click();
   }
});


// Send chat to server
function sendChat(){
   	server.emit('chat_message', {chat: $('#chat').val()});

   	console.log($('#chat').val());
   	$('#chat').val('');
}

// Send user information to server
function sendLogin(){
   	server.emit('login_message', {user: $('#username').val()});

   	console.log($('#username').val());
   	$('#username').val('');

    //After login hide login info and show chat window
   	$("#user_div").hide();
    $("#chat_window").show();
    $("#chat_message").show();
    $("#chat").focus();
}