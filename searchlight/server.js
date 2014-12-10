var express = require("express");
var app = express();
var server = require('http').Server(app);
var _ = require("underscore");
var port = process.env.PORT || 3000;

var Cylon = require('cylon');

app.use(express.static(__dirname + '/public'));

Cylon.robot({
	connections: {
		leap: { adaptor: 'leapmotion' },
	},

	devices: {
		leapmotion: { driver: 'leapmotion', connection: 'leap' },
	},

	work: function(my) {

	}
}).start();

server.listen(port, function () {
	console.log("server listening at port " + port);
});
