// jquery code //

$(document).ready(function() {
	// declare variables & initial settings
	var user = {};	// object to hold new user information	
	
	// load socket.io on client side, connects to server
	var socket = io();					

	// display all users chatting upon login
	socket.on('displayUsers', function(data) {
		var users = data;
		var length = data.length;
		for (var i=0;i<length;i++) {
			//alert(users[0].name);
			//$("#chatters").append("<li>"+users[i].name+"</li>");
		}
 
	});
	
	// new user to add to chat
	socket.on('addUser', function(data) {
		//console.log(data.name);
		//console.log(data.avatar);
		// add name to members list
		$("#chatters").append("<li>"+data.name+"</li>");
		
		// show in log that someone joined
		$("#chatLog").append("<li>"+data.name+" just joined</li>");
	});	
	
	// show message in chat log
	socket.on('chatMessage', function(data) {
		//$("#chatLog").append("<li>"+msg+"</li>");
		console.log(data.name);
		console.log(data.avatar);
		$("#chatLog").append($('<li>').text(data.msg));
	});
	
 
	//***** event listeners *****//
	
	//set avatar
	$(document).on("click", "#chatLogin img", function() {
		user.avatar = $(this).attr("data-name");
	});
	
	// login user
	$(document).on("click", "#chatLogin button", function() {
		user.name = $("#username").val().trim();
		if (user.name == "") {
			alert("Please input a valid username.");
		} else if (!user.avatar) {
			alert("Please select an avatar.");
		} else {
			socket.emit("login", user);
			$("#loginPage").css("display", "none");
			$("#chatPage").css("display", "block");
			//window.location = "/api/create"; 
		}
	});

	// send message
	$(document).on("click", "#chatRoom i", function() {
		user.msg = $('#chatRoom input').val();
		console.log(user);
		// emit message to server
		//socket.emit('chatMessage', $('#chatRoom input').val());
		socket.emit('chatMessage', user);
		// clear input box after send
		$('#chatRoom input').val('');
		// broadcast message to all
	});

});



