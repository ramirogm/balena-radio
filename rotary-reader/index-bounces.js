const Gpio = require('onoff').Gpio;
const dgram = require('dgram');
const { Buffer } = require('buffer');
const { hrtime } = require('process');


console.log("rotary reader starting");
const clkPin = process.env.CLK_GPIO_PIN || 17;
const dtPin = process.env.DT_GPIO_PIN || 27;
const swPin = process.env.SW_GPIO_PIN || 22;

console.log(`Pins: CLK: ${clkPin} DT: ${dtPin} SW: ${swPin}`);

const clk = new Gpio(clkPin, 'in', 'falling', {debounceTimeout: 10});
const dt = new Gpio(dtPin, 'in', 'falling', {debounceTimeout: 10});
const sw = new Gpio(swPin, 'in', 'falling', {debounceTimeout: 10});


const clientSocket = dgram.createSocket('udp4');

let clicked = false;
let lastClickTime = hrtime.bigint();

/*
RotaryKnob events processing logic that converts into a counter taken from 
https://blog.sharedove.com/adisjugo/index.php/2020/05/10/using-ky-040-rotary-encoder-on-raspberry-pi-to-control-volume/

Here we're using onoff: https://www.npmjs.com/package/onoff onoff relies on sysfs files located at /sys/class/gpio 
For advanced GPIO, see https://www.npmjs.com/package/pigpio A wrapper for the pigpio C library to enable fast GPIO, PWM, servo control, state change notification and interrupt handling

Others from the same author:
https://github.com/fivdi/i2c-bus
https://github.com/fivdi/spi-device
https://github.com/fivdi/mcp-spi-adc
*/

let step = 5; // linear steps for increasing/decreasing volume
let paused = false // paused state

let counter = 0;
let clkLastState = clk.readSync()
let dtLastState = dt.readSync()
let swLastState = sw.readSync()

function sendCounterValue() {
  console.log("Counter ", counter);
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

// define functions which will be triggered on pin state changes
function clkClicked(value) {
  console.log('clkClicked');
  checkSpeed();
  // clkState = clk.readSync();
  clkState = value;
  dtState = dt.readSync();

  if ( clkState == 0 && dtState == 1 ) {
    counter = counter - step;
    setImmediate(() => sendCounterValue());
  }
}
 
 
function dtClicked(value) {
  console.log('dtClicked');
  checkSpeed();
  // dtState = dt.readSync();
  dtState = value;
  clkState = clk.readSync();

  if ( clkState == 1 && dtState == 0 ) {
    counter = counter + step;
    setImmediate(() => sendCounterValue());
  }
}
 
function swClicked() {
  paused = !paused;
  console.log("Paused ", paused);
}
                 
 
clk.watch((err, value) => {
    if (err) {
      throw err;
    }
    // clkClicked(value);
});

dt.watch((err, value) => {
    if (err) {
      throw err;
    }
    dtClicked(value);
});

sw.watch((err, value) => {
    if (err) {
      throw err;
    }
    console.log("swClicked ", value);
    swClicked();
});


process.on('SIGINT', _ => {
    dt.unexport();
    clk.unexport();
    sw.unexport();
  });

console.log("rotary reader started");

console.log("Initial clk:", clkLastState);
console.log("Initial dt:", dtLastState);
console.log("Initial sw:", swLastState);
console.log("=========================================");

  