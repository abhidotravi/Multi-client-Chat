var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);

var messages = $('#messages');
console.log('Client: Connecting to server '+server_name);

$(document).ready(function() {
    $("#user_div").show();
    $("#username").focus();
    $("#chat_window").hide();
    $("#chat_message").hide();
});


$('#bt-login').click(sendLogin);

$('#bt-send').click(sendChat);


server.on('chat_reply', function(data) {
    console.log('Client: Received message from server: '+data.text);
   	messages.append('<li>'+data.text+'</li>');
});


//Capture the "Enter" key press
$("#username").keypress(function(e) {
   if(e.which === 13) {
       $('#bt-login').click();
   }
});

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

   	$("#user_div").hide();
    $("#chat_window").show();
    $("#chat_message").show();
    $("#chat").focus();
}