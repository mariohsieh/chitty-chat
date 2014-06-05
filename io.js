// all socket.io code

module.exports = function(app,io) {
	
	var allUsers = [];		// users that currently in the chat
	var totalUsers = 0;
	
	// main event: on connect
	io.on('connection', function(socket) {
		console.log('a user connected');
		

		// on newUser
		socket.on('login', function(data) {
			socket.user = data;
			//user = data;
			allUsers.push(socket.user);
			console.log(allUsers);
			totalUsers = allUsers.length;
			
			// code to display existing users to new client
			socket.emit('displayUsers', allUsers);

			// broadcast new user info to all execept new client 
			socket.broadcast.emit('addUser', socket.user);
			//io.emit('addUser', user);
		});
		
		// on sent message
		socket.on('chatMessage', function(data) {
			//console.log('message: ' + msg);
			io.emit('chatMessage', data);
			//socket.broadcast.emit('chatMessage', msg);
		});


		// on disconnect
		socket.on('disconnect', function() {
			if (socket.user) {
				console.log(socket.user.name + ' disconnected');
				socket.broadcast.emit('userLeft', socket.user.name);
			} else 
				console.log('a user disconnected');

		});
		
	});
}
