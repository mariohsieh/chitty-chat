// all routing

module.exports = function(app,io) {
	app.get('/', function(req,res) {
		//res.send('holla');
		res.sendfile('./public/index.html');
	});
}
