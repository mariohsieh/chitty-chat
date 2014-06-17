// all socket.io code

module.exports = function(app,io) {
	
	var onlineUsers = [];		// users that are currently in the chat
	var totalUsers = 0;
	
	// main event: on connect
	io.on('connection', function(socket) {
		console.log('a user connected');
		socket.emit('initial', onlineUsers);
		
		
		//// events for clients ////
		// on newUser
		socket.on('login', function(data) {
			socket.user = data;
			//user = data;
			onlineUsers.push(socket.user.name);
			console.log(onlineUsers);
			totalUsers = onlineUsers.length;
			
			// code to display existing users to new client
			socket.emit('welcomeUser', onlineUsers);

			// broadcast new user info to all execept new client 
			socket.broadcast.emit('addUser', socket.user);
			//io.emit('addUser', user);
		});
		
		// on sent message
		socket.on('chatMessage', function(data) {
			// broadcast message to all clients
			io.emit('chatMessage', data);
			//socket.broadcast.emit('chatMessage', msg);
		});


		// on disconnect
		socket.on('disconnect', function() {
			if (socket.user) {
				// remove user from onlineUsers array
				var index = onlineUsers.indexOf(socket.user.name);
				onlineUsers.splice(index,1);
				console.log(onlineUsers);

				// broadcast to all that user left								
				console.log(socket.user.name + ' disconnected');
				socket.broadcast.emit('userLeft', socket.user.name);
			} else 
				console.log('a user disconnected');

		});
		
	});
}
