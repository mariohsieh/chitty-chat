// jquery code //

$(document).ready(function() {
	// declare variables & initial settings
	var user = {};			// object to hold new user information	
	var socket = io();		// load socket.io on client side, connect to server
					
	
	//***** socket event *****//
	socket.on('initial', function(data) {
			var users = data;
			
			// disable avatar if already taken
			for (var key in users) {
				$("img[data-name='"+key+"']").addClass("inactive");
			}
	});

	// display all users chatting upon login
	socket.on('welcomeUser', function(data) {
		console.log(users);
		var users = data;
		var length = data.length;

		for (var key in users) {
			$("#"+key).addClass("online");
			$("#"+key+" i").removeClass("fa-circle-o").addClass("fa-circle").css("color", "green");
			if (user.name != $("#"+key).attr('id'))
				$("#"+key).addClass("pointer");
		}
	});
	
	// new user joined the chat
	socket.on('addUser', function(data) {
		//console.log(data.name);
		//console.log(data.avatar);

		// add name to members list
		//$("#chatters").append("<li id='"+data.name+"'>"+data.name+"</li>");
		if (user.name) {
			// show in chat log that someone joined
			$(".chatLog").append("<li class='admin text-center'>*** "+data+" just joined ***</li>");
			$("#"+data).addClass("online").addClass("pointer");
			$("#"+data+" i").removeClass("fa-circle-o").addClass("fa-circle").css("color", "green");
		} else {
			// on login screen, make user available
			$("img[data-name='"+data+"']").addClass("inactive");
		}
	});	
	
	// show message in chat log
	socket.on('chatMessage', function(data) {
		//console.log(data.msg);
		if (user.name) {	// if logged in
			var currentTime = "just now";
			var message = "<div><i class='fa fa-quote-left'></i><pre class='textContent text-left'>"+data.msg+"</pre>";
			message += "<i class='fa fa-quote-right text-right'></i><p class='textTime text-right'></p></div>";
			var image = "<img class='img-circle' src='img/"+data.name+".jpg' />";
			if (data.name == user.name)	// your own messages
				$(".chatLog").append("<li class='send pull-right'>"+message+"<span class='cornerSend'></span>"+image+"</li>");
			else // everyone else's messages
				$(".chatLog").append("<li class='receive pull-left'>"+image+"<span class='cornerReceive'></span>"+message+"</li>");
			//$(".chatLog").lastChild().fadeIn(1000);
		}
	});
	
	// user leaves
	socket.on('userLeft', function(data) {
		if (user.name) {	// if logged in
			$(".chatLog").append("<li class='admin text-center'>*** "+data+" just left ***</li>");
			$("#"+data).removeClass("online").removeClass("pointer");
			$("#"+data+" i").removeClass("fa-circle").addClass("fa-circle-o").css("color", "inherit");
		} else {
			$("img[data-name='"+data+"']").removeClass("inactive");
		}
	});
 
	//***** event listeners *****//
	// choose user
	$(document).on("click", "#chatLogin img", function() {
		if (!$(this).hasClass('inactive')) {
			$("#chatLogin li div").removeClass("selected");
			$(this).next().addClass("selected");
			user.name = $(this).attr("data-name");
			//console.log(user.name);
			$('#username').val(user.name);
		}
	});
	
	// login user
	$(document).on("click", "#chatLogin button", function() {
		//user.name = $("#username").val().trim();
		if (!user.name)
			alert("please select a user");
		else {
			$("#chatRoom").prepend("<h2>welcome - " + user.name + "</h2>");
			socket.emit("login", user);					// send user info to server
			$("#loginPage").css("display", "none");		// hide login screen
			$("#chatPage").css("display", "block");		// show chat screen
			$("footer").css("display", "block");		// show chat input
			$("#username").val('');						// clear username;
		}
	});

	// send message
	$(document).on("click", "footer i", function() {
		user.msg = $('footer textarea').val().trim();
		if (user.msg != '') {
			// emit message to server
			socket.emit('chatMessage', user);
			// clear input box after send
			$('footer textarea').val('');
		}
	});

	// start private chat
	$(document).on("dblclick", "#chatters li", function() {
		var chosen = $(this).attr('id');
		if ($(this).hasClass("online") && chosen != user.name) {
			$("#chatMenu").append("<li class='tab-menu'><a href='#"+chosen+"Chat'>"+chosen+"</a></li>");
			$(".tab-content").append("<div id='"+chosen+"Chat' class='tab-pane'></div>");
		}
	});
	
	// switch to chat
	$(document).on("click", "#chatMenu li", function() {
		var chosen = $(this).text();
		$("#chatMenu li").removeClass("active");
		$(this).addClass("active");
		$(".tab-content > div").removeClass("active");
		$("#"+chosen+"Chat").addClass("active");
		if (chosen != "all")
			user.target = "chosen";
	});
	
/*
	// message input rollover
	$(document).on("mouseover", "footer", function() {
		$("footer > i").css("display", "none");
		$("footer > section").fadeIn("fast");
	});
	$(document).on("mouseout", "footer", function() {
		$("footer > i").fadeIn("fast");
		$("footer > section").css("display", "none");
	});	
*/	

	/*** animation events ***/
	$("footer").on("transitionend webkitTransitionEnd oTransitionEnd", function() {
		var hovered = $("footer").css("height");		
		if (hovered == "150px") {
			$("footer > i").css("display", "none");
			$("footer > section").css("display", "inherit");
		} else {
			$("footer > i").css("display", "inherit");
			$("footer > section").css("display", "none");
		}
		
	});

});



