const Gpio = require('onoff').Gpio;
const dgram = require('dgram');
const { Buffer } = require('buffer');
const { hrtime } = require('process');
const nodaryEncoder = require('nodary-encoder');

console.log("rotary reader starting");
const clkPin = process.env.RENC_CLK_GPIO_PIN || 17;
const dtPin = process.env.RENC_DT_GPIO_PIN || 27;
const swPin = process.env.RENC_SW_GPIO_PIN || 22;
console.log(`Pins: CLK: ${clkPin} DT: ${dtPin} SW: ${swPin}`);

const listenerPort = process.env.RENC_LISTENER_PORT | '8001';
const listenerAddress = process.env.RENC_LISTENER_ADDRESS | 'localhost';

const rotEncoder = nodaryEncoder(clkPin, dtPin);

const sw = new Gpio(swPin, 'in', 'falling', {debounceTimeout: 10});

const clientSocket = dgram.createSocket('udp4');

let clicked = false;
let lastClickTime = hrtime.bigint();

/*
RotaryKnob events processing logic that converts into a value


Here we're using onoff: https://www.npmjs.com/package/onoff onoff relies on sysfs files located at /sys/class/gpio, 
and https://github.com/smallab/nodary-encoder to read the encoder value
For advanced GPIO, see https://www.npmjs.com/package/pigpio A wrapper for the pigpio C library to enable fast GPIO, PWM, servo control, state change notification and interrupt handling

Others from the same author:
https://github.com/fivdi/i2c-bus
https://github.com/fivdi/spi-device
https://github.com/fivdi/mcp-spi-adc
*/

let paused = false // paused state

let counter = 0;
let swLastState = sw.readSync()

rotEncoder.on('rotation', (direction, value) => {
  if (direction == 'R') {
    console.log('Encoder rotated right');
  } else {
    console.log('Encoder rotated left');
  }
  if ( counter != value ) {
    counter = value;
    sendClickInfo(direction, value);
  }
});


function sendClickInfo(direction, value) {
  counter = value;
  console.log("Counter ", counter);
  const lapseInMs = lapseFromLastClick();
  const message = Buffer.alloc(9);
  message.writeUint8(direction.charCodeAt(0), 0);
  // const valueInBytes = intToByteArray(value);
  // for ( let i = 0; i < 4; i++ ) {
  //   message[i+1] = valueInBytes[i];
  // }
  // const lapseInBytes = intToByteArray(lapseInMs);
  // for ( let i = 0; i < 4; i++ ) {
  //   message[i+5] = lapseInBytes[i];
  // }
  message.writeInt32BE(value, 1);
  message.writeInt32BE(lapseInMs, 5);
  clientSocket.send(message, listenerPort, listnerAddress, (err) => {
    if ( err ) {
      console.error("Error when sending packet", err)
    }
  });
}

function lapseFromLastClick() {
  if ( !clicked ) {
    clicked = true;
    lastClickTime = hrtime.bigint();
    return 0;
  } else {
    const now = hrtime.bigint();
    const dif = now - lastClickTime;
    const difInt = Number(dif);

    lastClickTime = now;
    const lapseInMs = difInt / 1000000;
    console.log(`Time between clicks: ${lapseInMs} milliseconds`);
    return lapseInMs;
  }
}

function swClicked() {
  paused = !paused;
  console.log("Paused ", paused);
}
                 
 
sw.watch((err, value) => {
    if (err) {
      throw err;
    }
    console.log("swClicked ", value);
    swClicked();
});


process.on('SIGINT', _ => {
    sw.unexport();
  });

console.log("rotary reader started");

console.log("Initial sw:", swLastState);
console.log("=========================================");

function intToByteArray(intValue) {
  // we want to represent the input as a 4-byte array
  var byteArray = [0, 0, 0, 0];

  for ( var index = 0; index < byteArray.length; index ++ ) {
      var byte = intValue & 0xff;
      byteArray [ index ] = byte;
      intValue = (intValue - byte) / 256 ;
  }

  return byteArray;
};

  