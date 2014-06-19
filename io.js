// all socket.io code

module.exports = function(app,io) {
	
	var onlineUsers = [];		// array of all connected
	var clients = {};			// object of all users connected
	var totalUsers = 0;
	
	// main event: on connect
	io.on('connection', function(socket) {
		console.log('a user connected');
		socket.emit('initial', clients);
		
		//// events for clients ////
		// on newUser
		socket.on('login', function(data) {
			socket.user = data;

			// add new user to client list
			clients[socket.user.name] = socket.id;
			console.log(clients);
			
			// code to display existing users to new client
			socket.emit('welcomeUser', clients);

			// broadcast new user info to all execept new client 
			socket.broadcast.emit('addUser', socket.user.name);
			//io.emit('addUser', user);
		});
		
		// on sent message
		socket.on('chatMessage', function(data) {
			console.log(data);
			if (data.target) {
				
			} else {
				// broadcast message to all clients
				io.emit('chatMessage', data);
				//socket.broadcast.emit('chatMessage', msg);
			}
		});


		// on disconnect
		socket.on('disconnect', function() {
			if (socket.user) {
				// remove user from onlineUsers array
				delete clients[socket.user.name];
				console.log(clients);
								
				// broadcast to all clients that user left								
				socket.broadcast.emit('userLeft', socket.user.name);
				
				// server log that user left
				console.log(socket.user.name + ' disconnected');
			} else 
				console.log('a user disconnected');

		});
		
	});
}
