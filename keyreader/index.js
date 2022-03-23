const dgram = require('dgram');
const { Buffer } = require('buffer');
const { hrtime } = require('process');
const readline = require('readline');


const listenerPort = process.env.LISTENER_PORT || '8001';
const listenerAddress = process.env.LISTENER_ADDRESS || 'localhost';
const logEnabled = "1" === process.env.LOG_ENABLED || true;
const delta = 1;

const clientSocket = dgram.createSocket('udp4');

let clicked = false;
let lastClickTime = hrtime.bigint();

let counter = 0;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


process.stdin.on('keypress', (str, key) => {
  logEnabled && console.log(`keypress key: ${key}`);
  if (key.ctrl && key.name === 'c') {
    process.kill(process.pid, 'SIGINT')
  }
  let direction;
  let value;
  if (key.name === process.env.RIGHT_KEY) {
    direction = 'R';
    value = delta
  } else if (key.name === process.env.LEFT_KEY) {
    direction = 'L';
    value = -delta;
  } else if (key.name === process.env.PUSH_KEY) {
    direction = 'C';
    value = 0;
  } else {
    return;
  }
  sendClickInfo(direction, value);
})


// Mouse events you said? Check https://github.com/TooTallNate/keypress

function sendClickInfo(event, value) {
  counter = value;
  const lapseInMs = lapseFromLastClick();
  const message = Buffer.alloc(9);
  message.writeUint8(event.charCodeAt(0), 0);
  message.writeInt32BE(value, 1);
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
    lastClickTime = hrtime.bigint();
    return 0;
  } else {
    const now = hrtime.bigint();
    const dif = now - lastClickTime;
    const difInt = Number(dif);

    lastClickTime = now;
    const lapseInMs = difInt / 1000000;
    logEnabled && console.log(`Time between clicks: ${lapseInMs} milliseconds`);
    return lapseInMs;
  }
}
