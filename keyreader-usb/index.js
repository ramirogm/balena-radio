const dgram = require('dgram');
const { Buffer } = require('buffer');
const { hrtime } = require('process');
const readline = require('readline');
// const KeyboardCharacters = require('node-hid-stream').KeyboardCharacters;
const Keyboard = require('node-hid-stream').Keyboard;
// This returns events like keypress key: {"modifiers":{"l_shift":false,"l_control":false,"l_alt":false,"l_meta":false,"r_control":false,"r_shift":false,"r_alt":false,"r_meta":false},"keyCodes":[79],"charCodes":["","","","","",""],"errorStatus":false}
const vendorId = parseInt(process.env.VENDOR_ID || '0f39', 16);
const productId = parseInt(process.env.PRODUCT_ID || '0877', 16);

const listenerAddress = process.env.LISTENER_ADDRESS || 'localhost';
const listenerPort = process.env.LISTENER_PORT || '8001';
const logEnabled = "1" === process.env.LOG_ENABLED;
const delta = 1;

const clientSocket = dgram.createSocket('udp4');

let clicked = false;
let lastClickTime = currentTimeMilis();

let counter = 0;

console.log(`keyreader-usb starting listenerAddress: ${listenerAddress} listenerPort: ${listenerPort} logEnabled: ${logEnabled} leftKey: ${process.env.LEFT_KEY} rightKey: ${process.env.RIGHT_KEY} pushKey: ${process.env.PUSH_KEY}`);

// const characters = new KeyboardCharacters({ vendorId, productId });
const characters = new Keyboard({ vendorId, productId });

characters.on("data", function(key) {
  logEnabled && console.log(`keypress key: ${JSON.stringify(key)}`);
  let direction;
  let value;
  if (key.charCodes != null && key.charCodes[0] === process.env.RIGHT_KEY) {
    direction = 'R';
    value = delta
  } else if (key.charCodes != null && key.charCodes[0] === process.env.LEFT_KEY) {
    direction = 'L';
    value = -delta;
  } else if (key.charCodes != null && key.charCodes[0] === process.env.PUSH_KEY) {
    direction = 'C';
    value = 0;
  } else {
    return;
  }
  sendClickInfo(direction, value);
})


function currentTimeMilis() {
  const NS_PER_SEC = 1e9;
  const time = process.hrtime();
  // [ 1800216, 25 ]
  const timeInMs = time[0] * NS_PER_SEC + time[1];
  return timeInMs;
}

// Mouse events you said? Check https://github.com/TooTallNate/keypress

function sendClickInfo(event, value) {
  counter += value;
  const lapseInMs = lapseFromLastClick();
  const message = Buffer.alloc(9);
  message.writeUInt8(event.charCodeAt(0), 0);
  message.writeInt32BE(counter, 1);
  message.writeInt32BE(lapseInMs, 5);
  clientSocket.send(message, listenerPort, listenerAddress, (err) => {
    if ( err ) {
      console.error("Error when sending packet", err)
    }
  });
}

function lapseFromLastClick() {
  if ( !clicked ) {
    clicked = true;
    lastClickTime = currentTimeMilis();
    return 0;
  } else {
    const now = currentTimeMilis();
    const dif = now - lastClickTime;
    const difInt = Number(dif);

    lastClickTime = now;
    const lapseInMs = difInt / 1000000;
    logEnabled && console.log(`Time between clicks: ${lapseInMs} milliseconds`);
    return lapseInMs;
  }
}
