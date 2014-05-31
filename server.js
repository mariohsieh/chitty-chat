// server.js

// dependencies //
var express = require("express");
	app = express(),
	io = require("socket.io");

// configuration //
var port = Number(process.env.PORT || 9009);		// set port number
app.configure(function() {
	app.set("view engine", "html");					// set .html as default template extension
	app.set("views", __dirname + '/public/views');	// set template location
	app.use(express.logger('dev'));					// log ever request to the console
	app.use(express.static(__dirname + '/public'));	// sets files in public folder to public
	
	// optional //
	//app.engine('html', require(***).renderFile);	// sets html templating engine
	//io.set('log level', 1);						// hide log messages from socke.io
});
	
// routing //
require('./routes')(app,io);

// open server //
io.listen(app.listen(port, function() {
	console.log("Listening on " + port);
}));
