const dgram = require('dgram');
const Gpio = require('onoff').Gpio;
const {
  startDisplay,
  displayFrequency
} = require('./display');
const loudness = require('loudness')
const displayType = process.env.DISPLAY_TYPE || "NONE";

console.log("finradio controller starting");
( displayType != "NONE" ) && startDisplay();

const initialFrequencyMhz = parseFloat(process.env.INITIAL_FREQUENCY_MHZ || 102.7);
let currentFrequencyInMhz = initialFrequencyMhz;

const yellowPin = process.env.YELLOW_GPIO_PIN || 26;
const greenPin = process.env.GREEN_GPIO_PIN || 6;
console.log(`LEDs: YELLOW: ${yellowPin} GREEN: ${greenPin}`);

const yellowLed = new Gpio(yellowPin, 'out');
const greenLed = new Gpio(greenPin, 'out');

const dialListener = dgram.createSocket('udp4');
const clientSocket = dgram.createSocket('udp4');
const volumeListener = dgram.createSocket('udp4');

let lasTunerValue = 0;
let currentVolume = 0;

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
  console.log(`dialListener decoded message. event: ${event} value: ${value} lapse: ${lapse}`);
  receivedTunerEvent(event, value);
});

dialListener.on('listening', () => {
  const address = dialListener.address();
  console.log(`dialListener listening ${address.address}:${address.port}`);
});

dialListener.bind(8001);

function receivedTunerEvent(event, tunerValue) {
  console.log(`event: ${event} tunerValue: ${tunerValue} lasTunerValue: ${lasTunerValue}`);
  if ( event == 67 ) {
    // dial knob push button pushed
    lasTunerValue = tunerValue;
    
    currentFrequencyInMhz = initialFrequencyMhz;
    sendTunerFrequencyToRadio(currentFrequencyInMhz);
  
    // LED Feedback
    flashLed(yellowLed);
    flashLed(greenLed);
    return;
  }
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

// Writes the int as an int32 LE since this is what the rtl_udp program expects
// Could use buffer.writeInt32LE() and return the buffer
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
  ( displayType != "NONE" ) && displayFrequency(freqInMhz);
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
  currentVolume = vol;
}

checkVol();

volumeListener.on('error', (err) => {
  console.log(`volumeListener error:\n${err.stack}`);
  volumeListener.close();
  process.exit(1);
});

volumeListener.on('message', (msg, rinfo) => {
  const {event, value, lapse} = decodeMessage(msg);
  console.log(`volumeListener decoded message. event: ${event} value: ${value} lapse: ${lapse}`);
  if ( event != 67 ) {
    const delta = event == 76 ? -2 : 2; 
    currentVolume = Math.max(0,Math.min(currentVolume + delta,100));
    console.log(`setting volume to: ${currentVolume}%`);
    loudness.setVolume(currentVolume);
  }
});

volumeListener.on('listening', () => {
  const address = volumeListener.address();
  console.log(`volumeListener listening ${address.address}:${address.port}`);
});

volumeListener.bind(8002);



console.log("finradio controller started");

/*


const led = new Gpio(17, 'out');       // Export GPIO17 as an output

// Toggle the state of the LED connected to GPIO17 every 200ms
const iv = setInterval(_ => led.writeSync(led.readSync() ^ 1), 200);

// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(iv); // Stop blinking
  led.unexport();    // Unexport GPIO and free resources
}, 5000);



*/