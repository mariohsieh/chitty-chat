// all routing

module.exports = function(app,io) {
	app.get('/', function(req,res) {
		res.sendfile('./public/index.html');
	});
	
	app.get('/api/create', function(req,res) {
		// use random num to generate a unique chat room id
		//var id = Math.round(Math.random()*999999);
		
		// redirect to chat room
		res.redirect('/chat');
		//res.redirect('/chat/'+id);
	});

	//app.get('/chat/:id', function(req,res) {
	app.get('/chat', function(req,res) {
		res.sendfile('./public/views/chat.html');
	});
}
