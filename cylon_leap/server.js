var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Cylon = require('cylon'); // cylon: pkg die verschillende device laat communiceren met elkaar (hier: arduino + leap)
var five = require('johnny-five'); // johnny-five: pkg om de arduino aan te sturen met Node.js (eerst firmata uploaden naar je arduino -- zie cursus)
var _ = require("underscore");
var port = process.env.PORT || 3000;

var board, led;

app.use(express.static(__dirname + '/public')); // Express = framework voor Node.js applicaties. Dit zorgt ervoor dat public/index.html gebruikt wordt

//SERVER CODE

// Ervoor zorgen dat Nodemon draait -> surfen naar localhost:3000


io.on("connection",function(socket){

	console.log(socket.id + " connected");	// In terminal kijken of er een socketid uitgelezen wordt

	board = new five.Board(); // johnny initialiseren

	board.on('ready',function(){
		console.log("MY BOARD IS READY"); // checken of het bord er helemaal ready voor is
	});	

	Cylon.robot({  // een cylon robot is een aaneenschakeling van devices, hier nog maar 1 device (soon ...) -> leap
		connection: {
			name: 'leapmotion',
			adaptor: 'leapmotion'
		},

		device: {
			name: 'leapmotion',
			driver: 'leapmotion'
		},

		work: function(my) {  // Dit wordt getriggerd als er een hand gedetecteerd wordt 

			my.leapmotion.on('hand', function(payload) {	// in de "payload" zit de data va nde getrackte hand 			
				
				led = new five.Led(13); // LED 13 is de onboard led van de arduino. Deze zal branden als er een hand gedetecteerd wordt door leap
				led.on();						
				// console.log(payload.toString());	// AANZETTEN ALS JE DE TRACKINGDATA IN DE CONSOLE WIL UITLEZEN

				io.sockets.emit("connect_disconnect", payload.toString()); // dit kan opgevangen worden in /_js/app.js om er clientside iets mee te doen			

			});
		}
	}).start();	

	socket.on("disconnect",function(){		
		console.log(socket.id + " disconnected");
	});

});


server.listen(port, function () {
	// console.log('Server listening at port ' + port);
});
