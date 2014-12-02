var express = require("express");
var app = express();
var server = require('http').Server(app);
// var io = require('socket.io')(server);
var Cylon = require('cylon'); // cylon: pkg die verschillende device laat communiceren met elkaar (hier: arduino + leap)
// var five = require('johnny-five'); // johnny-five: pkg om de arduino aan te sturen met Node.js (eerst firmata uploaden naar je arduino -- zie cursus)
var _ = require("underscore");
var port = process.env.PORT || 3000;

var board, led;
var angle = 0;
var handX = 0;

app.use(express.static(__dirname + '/public')); // Express = framework voor Node.js applicaties. Dit zorgt ervoor dat public/index.html gebruikt wordt


Cylon.robot({  // een cylon robot is een aaneenschakeling van devices, hier nog maar 1 device (soon ...) -> leap

	connections: {
		leapmotion: { adaptor: 'leapmotion' },
		arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1421' }		
	},

	devices: {
		leapmotion: { driver: 'leapmotion', connection: 'leap' },
		servo: { driver: 'servo', pin: 3, connection: 'arduino' }	
	},

	work: function(my) {  // Dit wordt getriggerd als er een hand gedetecteerd wordt 

		my.leapmotion.on('hand', function(payload) {	// in de "payload" zit de data va nde getrackte hand

			my.leapmotion.on('frame', function(frame){					
				if(frame.hands.length > 0) {
					handX = frame.hands[0].palmPosition[0];
					angle = (handX).fromScale(-255, 255).toScale(0, 180);
					my.servo.angle(angle);
					console.log(angle);
				}
			});				
		});

	}
}).start();	



server.listen(port, function () {

});
