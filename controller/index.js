const dgram = require('dgram');
const Gpio = require('onoff').Gpio;

console.log("finradio controller starting");
const yellowPin = process.env.YELLOW_GPIO_PIN || 26;
const greenPin = process.env.GREEN_GPIO_PIN || 6;
console.log(`LEDs: YELLOW: ${yellowPin} GREEN: ${greenPin}`);

const yellowLed = new Gpio(yellowPin, 'out');
const greenLed = new Gpio(greenPin, 'out');

const dialListener = dgram.createSocket('udp4');
const clientSocket = dgram.createSocket('udp4');

let lasTunerValue = 0;

dialListener.on('error', (err) => {
  console.log(`dialListener error:\n${err.stack}`);
  dialListener.close();
});

dialListener.on('message', (msg, rinfo) => {
  if ( process.env.LOG_LEVEL="trace") {
    console.log(`dialListener got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  }
  const matches = msg.toString().match(/\[(.*)\]/);
  if ( matches ) {
    const value = parseInt(matches[1], 10);
    if ( value != null ) { 
      receivedTunerValue(value);
    }
  }
});

dialListener.on('listening', () => {
  const address = dialListener.address();
  console.log(`dialListener listening ${address.address}:${address.port}`);
});

dialListener.bind(8001);
// Prints: dialListener listening 0.0.0.0:41234

function receivedTunerValue(tunerValue) {
  console.log(`tunerValue: ${tunerValue} lasTunerValue: ${lasTunerValue}`);
  const message = Buffer.alloc(1);
  if ( tunerValue === lasTunerValue ) {
    return;
  }
  message[0] = tunerValue < lasTunerValue ? 4 : 5;
  lasTunerValue = tunerValue;
  if ( process.env.LOG_LEVEL="trace") {
    console.log(`Sending message ${JSON.stringify(message)} to ${process.env.RADIO_HOSTNAME}:${process.env.RADIO_PORT}`);
  }
  clientSocket.send(message, process.env.RADIO_PORT, process.env.RADIO_HOSTNAME, (err) => {
    if ( err ) {
      console.error("Error when sending packet", err)
    }
  });
  // LED Feedback
  if ( message[0] == 4 ) {
    flashLed(greenLed);
  } else {
    flashLed(yellowLed)
  }
}


console.log("finradio controller started");
function flashLed(led) {
  led.writeSync(1);
  setTimeout(() => {
    led.writeSync(0);
  }, 10);
}

