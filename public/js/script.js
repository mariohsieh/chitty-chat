// jquery code //

$(document).ready(function() {

	var socket = io();		// load socket.io on client side, connects to server

	//***** event listeners *****//
	// login
	$(document).on("click", "#chatLogin button", function() {
		//console.log('holla');
		window.location = "/api/create";
	});

	// send message
	$(document).on("click", "#chatRoom button", function() {
		// emit message to server
		socket.emit('chat message', $('#chatRoom input').val());
		// clear input box after send
		$('#chatRoom input').val('');
	});
});



