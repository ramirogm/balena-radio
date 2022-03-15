const Gpio = require('onoff').Gpio;
const dgram = require('dgram');
const { Buffer } = require('buffer');
const { hrtime } = require('process');
const nodaryEncoder = require('nodary-encoder');

console.log("rotary reader starting");
const clkPin = process.env.CLK_GPIO_PIN || 17;
const dtPin = process.env.DT_GPIO_PIN || 27;
const swPin = process.env.SW_GPIO_PIN || 22;

console.log(`Pins: CLK: ${clkPin} DT: ${dtPin} SW: ${swPin}`);

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
    sendCounterValue();
  }
});


function sendCounterValue() {
  console.log("Counter ", counter);
  checkSpeed();
  const message = Buffer.from("[" + counter + "]");
  clientSocket.send(message, process.env.LISTENER_PORT, process.env.LISTENER_ADDRESS, (err) => {
    if ( err ) {
      console.error("Error when sending packet", err)
    }
  });
}

function checkSpeed() {
  if ( !clicked ) {
    clicked = true;
    lastClickTime = hrtime.bigint();
  } else {
    const now = hrtime.bigint();
    const dif = now - lastClickTime;
    const difInt = Number(dif);

    lastClickTime = now;
    console.log(`Time between clicks: ${difInt / 1000000 } milliseconds`);
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

  