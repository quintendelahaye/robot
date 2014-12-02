var express = require("express");
var app = express();
var server = require('http').Server(app);
var _ = require("underscore");
var port = process.env.PORT || 3000;

var Cylon = require('cylon');

var handX = 0, angle = 0;

app.use(express.static(__dirname + '/public'));

Cylon.robot({
  connections: {
    leap: { adaptor: 'leapmotion' },
    arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1421' }
  },

  devices: {
    leapmotion: { driver: 'leapmotion', connection: 'leap' },
    servo: { driver: 'servo', pin: 3, connection: 'arduino' }
  },

  work: function(my) {
    my.leapmotion.on('frame', function(frame) {
      if(frame.hands.length > 0) {
        handX = frame.hands[0].palmPosition[0];
        angle = (handX).fromScale(-255, 255).toScale(0, 180);
        my.servo.angle(angle);
      }
    });
  }
}).start();

server.listen(port, function () {
  console.log("server listening at port " + port);
});
