const Gpio = require('onoff').Gpio;
const clk = new Gpio(17, 'in', 'falling', {debounceTimeout: 10});
const dt = new Gpio(18, 'in', 'falling', {debounceTimeout: 10});
const sw = new Gpio(22, 'in', 'falling', {debounceTimeout: 10});
const dgram = require('dgram');
const { Buffer } = require('buffer');


console.log("rotary reader starting");

const clientSocket = dgram.createSocket('udp4');

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

// define functions which will be triggered on pin state changes
function clkClicked() {
  clkState = clk.readSync();
  dtState = dt.readSync();

  if ( clkState == 0 && dtState == 1 ) {
    counter = counter - step;
    sendCounterValue();
  }

}
 
 
function dtClicked() {
  clkState = clk.readSync();
  dtState = dt.readSync();

  if ( clkState == 1 && dtState == 0 ) {
    counter = counter + step;
    sendCounterValue();
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
    clkClicked();
});

dt.watch((err, value) => {
    if (err) {
      throw err;
    }
    dtClicked();
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

  