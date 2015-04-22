var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
//var msgElement = document.getElementById('messages');
var messages = $('#messages');
console.log('Client: Connecting to server '+server_name);

$(document).ready(function() {
	$('#bt-send').click(function(){
   		server.emit('chat_message', {chat: $('#m').val()});

   		console.log($('#m').val());
   		//messages.prepend('<li>'+$('m').val()+'</li>');
 	});

	server.on('chat-reply', function(data) {
    	console.log('Client: Received message from server: '+data.text);
   		messages.prepend(data.text);
	});

});

//console.log(msgElement);