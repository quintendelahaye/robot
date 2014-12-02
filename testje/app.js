var Cylon = require('cylon');

var handX = 0, angle = 0;

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
