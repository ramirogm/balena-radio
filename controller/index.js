const dgram = require('dgram');
const Gpio = require('onoff').Gpio;
const {
  startDisplay,
  displayFrequency
} = require('./display');
const loudness = require('loudness')


console.log("finradio controller starting");
startDisplay();

const initialFrequencyMhz = parseFloat(process.env.INITIAL_FREQUENCY_MHZ || 102.7);
let currentFrequencyInMhz = initialFrequencyMhz;

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
  process.exit(1);
});

dialListener.on('message', (msg, rinfo) => {
  if ( process.env.LOG_LEVEL == "trace") {
    console.log(`dialListener got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  }
  const {event, value, lapse} = decodeMessage(msg);
  console.log(`decoded message. event: ${event} value: ${value} lapse: ${lapse}`);
  receivedTunerValue(value);
});

dialListener.on('listening', () => {
  const address = dialListener.address();
  console.log(`dialListener listening ${address.address}:${address.port}`);
});

dialListener.bind(8001);

function receivedTunerValue(tunerValue) {
  console.log(`tunerValue: ${tunerValue} lasTunerValue: ${lasTunerValue}`);
  if ( tunerValue === lasTunerValue ) {
    return;
  }
  const tuningDown = tunerValue < lasTunerValue;
  lasTunerValue = tunerValue;
  
  currentFrequencyInMhz = currentFrequencyInMhz + ( tuningDown ? -0.2 : 0.2 );
  sendTunerFrequencyToRadio(currentFrequencyInMhz);

  // LED Feedback
  flashLed(tuningDown ? greenLed : yellowLed);
}

function flashLed(led) {
  led.writeSync(1);
  setTimeout(() => {
    led.writeSync(0);
  }, 10);
}

// FIXME use a node.js-provided function
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


function decodeMessage(buffer) {
  let event, value, lapse;
  event = buffer[0];
  value = buffer.readInt32BE(1);
  lapse = buffer.readInt32BE(5);
  return { event, value, lapse};
}

function sendTunerFrequencyToRadio(freqInMhz) {
  displayFrequency(freqInMhz);
  const message = Buffer.alloc(5);
  message[0] = 0; // Means set frequency

  // frequency sent as a value in Hz
  console.log(`freqInMhz: ${freqInMhz}`);
  const freqInHz = freqInMhz * 1000000;
  console.log(`freqInHz: ${freqInHz}`);
  const freqInHzBytes = intToByteArray(freqInHz);
  console.log(`freqInHzBytes: ${freqInHzBytes}`);
  for ( let i = 0; i < 4; i++ ) {
    message[i+1] = freqInHzBytes[i];
  }
  clientSocket.send(message, process.env.RADIO_PORT, process.env.RADIO_HOSTNAME, (err) => {
    if ( err ) {
      console.error("Error when sending packet", err)
    }
  });
}

sendTunerFrequencyToRadio(initialFrequencyMhz);

async function checkVol() {
  const vol = await loudness.getVolume()
  console.log(`Current volume: ${vol}`);
  await loudness.setVolume(45);
}

// disabled because amixer error
// checkVol();


console.log("finradio controller started");

