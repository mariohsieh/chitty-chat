// jquery code //

$(document).ready(function() {

	var socket = io();		// load socket.io on client side, connects to server

	// declare variables
	var user = {};			// object to hold new user information

	// display all users chatting
	socket.on('displayUsers', function(data) {
		console.log(data);
		var length = data.length;
		for (var i=0;i<length;i++) {
			$("#chatters").append("<li>"+data.i.name+"</li>");
		}
	});
	
	// new user to add to chat
	socket.on('addUser', function(data) {
		//console.log(data.name);
		//console.log(data.avatar);
		$("#chatters").append("<li>"+data.name+"</li>");
	});	
	
	// show message in chat log
	socket.on('chatMessage', function(msg) {
		//$("#chatLog").append("<li>"+msg+"</li>");
		$("#chatLog").append($('<li>').text(msg));
	});
	
 
	//***** event listeners *****//
	
	//set avatar
	$(document).on("click", "#chatLogin img", function() {
		user.avatar = $(this).attr("data-name");
	});
	
	// login
	$(document).on("click", "#chatLogin button", function() {
		user.name = $("#username").val().trim();
		socket.emit("login", user);
		window.location = "/api/create"; 
	});

	// send message
	$(document).on("click", "#chatRoom i", function() {
		// emit message to server
		socket.emit('chatMessage', $('#chatRoom input').val());
		// clear input box after send
		$('#chatRoom input').val('');
		// broadcast message to all
	});

});



