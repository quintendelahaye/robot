var express = require("express");
var app = express();
var server = require('http').Server(app);
var _ = require("underscore");
var port = process.env.PORT || 3000;

var Cylon = require('cylon');

var yaw = 0, pinch = 0, servo_angle = 0, servo2_angle = 0, frameCounter = 0;

app.use(express.static(__dirname + '/public'));

Cylon.robot({
  connections: {
    leap: { adaptor: 'leapmotion' },
    arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1421' }
  },

  devices: {
    leapmotion: { driver: 'leapmotion', connection: 'leap' },
    servo: { driver: 'servo', pin: 3, connection: 'arduino' },
    servo2: { driver: 'servo', pin: 9, connection: 'arduino' }
  },

  work: function(my) {


    my.leapmotion.on('frame', function(frame) {

        if(frame.hands.length > 0) {

        // console.log('duim top positie -> ' + frame.fingers[0].tipPosition[0] + '\n' + 'index top positie ->' + frame.fingers[1].tipPosition[0]);
        // console.log('afstand tussen duim en index -> ' + frame.fingers[0].tipPosition[0] + frame.fingers[1].tipPosition[0]);

        console.log(frame.hands[0].pinchStrength);

        // pinch = frame.hands[0].palmPosition[0];        

        pinch = frame.hands[0].pinchStrength;
        servo_angle = (pinch).fromScale(0, 1).toScale(0, 100);
        my.servo.angle(servo_angle);     

        yaw = frame.hands[0].yaw();
        servo2_angle = (yaw).fromScale(-2,2).toScale(0, 180);
        my.servo2.angle(servo2_angle);
      }

      
    
  });
  }
}).start();

server.listen(port, function () {
  console.log("server listening at port " + port);
});
