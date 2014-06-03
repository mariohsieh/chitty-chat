// all socket.io code

module.exports = function(app,io) {
	
	var allUsers = [];		// users that currently in the chat
	
	// main event: on connect
	io.on('connection', function(socket) {
		console.log('a user connected');
		

		// on newUser
		socket.on('login', function(data) {
			user = data;
			console.log(user);
			allUsers.push(user);
			
			// code to display existing users
			io.emit('displayUsers', allUsers);

			console.log(allUsers);			
			io.emit('addUser', user);
		});
		
		// on sent message
		socket.on('chatMessage', function(msg) {
			//console.log('message: ' + msg);
			io.emit('chatMessage', msg);
			//socket.broadcast.emit('chat message', msg);
		});


		// on disconnect
		socket.on('disconnect', function() {
			console.log('user disconnected');
		});
		
	});
}
