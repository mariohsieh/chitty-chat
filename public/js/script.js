// jquery code //

$(document).ready(function() {
	// declare variables & initial settings
	var user = {};			// object to hold new user information	
	var online;				// number of users online;
	var total;				// number of total users;
	var socket = io();		// load socket.io on client side, connect to server

					
	/******************************
			helper functions
	******************************/
	function displayMessage(info) {
		//var currentTime = "just now";
		var chatRoom;
		if (info.target) { // if private message
			if (info.target == user.name)	// to
				chatRoom = info.name + "Chat";
			else // from
				chatRoom = info.target + "Chat";
		} else
			chatRoom = "allChat";
		//console.log(chatRoom);
		//console.log(info);		
			
		var message = "<div><i class='fa fa-quote-left'></i><pre class='textContent text-left'>"+info.msg+"</pre>";
		message += "<i class='fa fa-quote-right text-right'></i><p class='textTime text-right'></p></div>";
		var image = "<img class='img-circle' src='img/"+info.name+".jpg' />";
		if (info.name == user.name)	// your own messages
			$("#"+chatRoom+" ul").append("<li class='send pull-right'>"+message+"<span class='cornerSend'></span>"+image+"</li>");
		else // everyone else's messages
			$("#"+chatRoom+" ul").append("<li class='receive pull-left'>"+image+"<span class='cornerReceive'></span>"+message+"</li>");
		//$(".chatLog").lastChild().fadeIn(1000);		
	}	
	
	function scrollDown() {
		$("html, body").animate({scrollTop: $(document).height()-$(window).height()}, 750);
	}
	
	
	/******************************
			socket events
	******************************/
	socket.on('initial', function(data) {
			var users = data;
			
			// disable avatar if already taken
			for (var key in users) {
				$("img[data-name='"+key+"']").addClass("inactive");
			}
	});

	// display all users chatting upon login
	socket.on('welcomeUser', function(data) {
		var users = data;
		online = 0;
		total = $("#chatters > li").length;
		//console.log(users);

		for (var key in users) {
			online++;
			$("#"+key).addClass("online");
			$("#"+key+" i").removeClass("fa-circle-o").addClass("fa-circle").css("color", "green");
			if (user.name != $("#"+key).attr('id'))
				$("#"+key).addClass("pointer");
		}
		$("#chatters").prepend("<li id='onlineCount'>(online "+online+"/"+total+")</li>");
	});
	
	// new user joined the chat
	socket.on('addUser', function(data) {
		// add name to members list
		//$("#chatters").append("<li id='"+data.name+"'>"+data.name+"</li>");
		if (user.name) {
			online++;
			// show in chat log that someone joined
			$("#allChat > ul").append("<li class='admin text-center'>*** "+data+" just joined ***</li>");
			$("#"+data).addClass("online").addClass("pointer");
			$("#"+data+" i").removeClass("fa-circle-o").addClass("fa-circle").css("color", "green");
			$("#onlineCount").text("(online "+online+"/"+total+")");
		} else {
			// on login screen, make user available
			$("img[data-name='"+data+"']").addClass("inactive");
		}
	});	
	
	// show message in all Chat
	socket.on('chatMessage', function(data) {
		//console.log(data.msg);
		if (user.name) {	// if logged in
			displayMessage(data);
			if ($("#allChat").hasClass("active"))
				scrollDown();
			else
				$("#allTab").addClass("unread");
		}

	});

	// show private messages
	socket.on('privateMessage', function(data) {
		//alert('hi');
		if ($("#"+data.name+"Chat").length == 0) { // create private chat if it doesn't exist
			$("#chatMenu").append("<li id='"+data.name+"Tab' class='tab-menu'><a href='#"+data.name+"Chat'>"+data.name+"</a></li>");
			$(".tab-content").append("<div id='"+data.name+"Chat' class='tab-pane'><ul class='chatLog'></ul></div>");
		}
		displayMessage(data);
		if ($("#"+data.name+"Chat").hasClass("active")) // if client has private chat open, scroll down on new message
			scrollDown();
		else
			$("#"+data.name+"Tab").addClass("unread");
	});
	socket.on('selfieMessage', function(data) {
		//console.log(data);
		displayMessage(data);
		scrollDown();
	});

	// user leaves
	socket.on('userLeft', function(data) {
		if (user.name) {	// if logged in
			online--;
			$("#allChat > ul").append("<li class='admin text-center'>*** "+data+" just left ***</li>");
			$("#"+data).removeClass("online").removeClass("pointer");
			$("#"+data+" i").removeClass("fa-circle").addClass("fa-circle-o").css("color", "inherit");
			$("#onlineCount").text("(online "+online+"/"+total+")");
		} else {
			$("img[data-name='"+data+"']").removeClass("inactive");
		}
	});
 
 
	/******************************
			event listeners
	******************************/
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
		if ($(this).hasClass("online") && chosen != user.name && $("#"+chosen+"Chat").length == 0) {
			$("#chatMenu").append("<li id='"+chosen+"Tab' class='tab-menu'><a href='' onclick='return false;'>"+chosen+"</a></li>");
			$(".tab-content").append("<div id='"+chosen+"Chat' class='tab-pane'><ul class='chatLog'></ul></div>");
		}
	});
	
	// switch to chat
	$(document).on("click", "#chatMenu li", function() {
		var chosen = $(this).text();
		$("#chatMenu li").removeClass("active");
		$(this).addClass("active");
		$(".tab-content > div").removeClass("active");
		$("#"+chosen+"Chat").addClass("active");
		$("#"+chosen+"Tab").removeClass("unread");
		
		if (chosen != "all")
			user.target = chosen;
		else
			delete user.target;
		//console.log(user);
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


	/******************************
			animation events
	******************************/
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


//////////// need to add //////////////////
/*

-scroll to top button
-new message indicator
 

*/ 

