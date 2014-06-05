// jquery code //

$(document).ready(function() {
	// declare variables & initial settings
	var user = {};	// object to hold new user information	
	//var sender;		// boolean for message type
	
	// load socket.io on client side, connects to server
	var socket = io();					

	// display all users chatting upon login
	socket.on('displayUsers', function(data) {
		var users = data;
		var length = data.length;
		//for (var i=0;i<length;i++) {
			//alert(users[0].name);
			//$("#chatters").append("<li>"+users[i].name+"</li>");
		//}
 		$("#chatters").append("<li id='"+user.name+"'>"+user.name+"</li>");
	});
	
	// new user joined the chat
	socket.on('addUser', function(data) {
		//console.log(data.name);
		//console.log(data.avatar);
		// add name to members list
		$("#chatters").append("<li id='"+data.name+"'>"+data.name+"</li>");
		
		// show in log that someone joined
		$("#chatLog").append("<li class='admin text-center'>***"+data.name+" just joined***</li>");
	});	
	
	// show message in chat log
	socket.on('chatMessage', function(data) {
		//$("#chatLog").append("<li>"+msg+"</li>");
		//console.log(data.name);
		//console.log(data.avatar);
		//console.log(user.name);
		if (data.name == user.name)
			$("#chatLog").append("<li class='send pull-right'><div><p>"+data.msg+"</p><p>"+data.name+"</p></div><img class='img-circle' src='img/"+data.avatar+".jpg' /></li>");
		else
			$("#chatLog").append("<li class='receive pull-left'><img class='img-circle' src='img/"+data.avatar+".jpg' /><div><p>"+data.msg+"</p><p>"+data.name+"</p></div></li>");
	});
	
	// user leaves
	socket.on('userLeft', function(data) {
		$("#chatLog").append("<li class='admin text-center'>***"+data+" just left***</li>");
		$("#"+data).remove();
	});
 
	//***** event listeners *****//
/*
	// avatar mouseover
	$(document).on("mouseover", "#chatLogin img", function() {
		$(this).next().css("background-color", "#000");
	});

	$(document).on("mouseout", "#chatLogin img", function() {
		$(this).next().css("background-color", "#FAFAFA");
	});
*/
	//set avatar
	$(document).on("click", "#chatLogin img", function() {
		$("#chatLogin li div").removeClass("active");
		$(this).next().addClass("active");
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
			socket.emit("login", user);					// send user info to server
			$("#loginPage").css("display", "none");		// hide login screen
			$("#chatPage").css("display", "block");		// show chat screen
			//window.location = "/api/create";
			$("#username").val('');						// clear username;
		}
	});

	// send message
	$(document).on("click", "#chatRoom i", function() {
		user.msg = $('#chatRoom textarea').val();
		//console.log(user);
		// emit message to server
		//socket.emit('chatMessage', $('#chatRoom input').val());
		socket.emit('chatMessage', user);
		// clear input box after send
		$('#chatRoom textarea').val('');
		// broadcast message to all
	});

});



