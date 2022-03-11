const dgram = require('dgram');
console.log("finradio controller starting");

const dialListener = dgram.createSocket('udp4');
const clientSocket = dgram.createSocket('udp4');

let tunerPosition = 0;

dialListener.on('error', (err) => {
  console.log(`dialListener error:\n${err.stack}`);
  dialListener.close();
});

dialListener.on('message', (msg, rinfo) => {
  console.log(`dialListener got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const matches = msg.toString().match(/\[(.*)\]/);
  if ( matches ) {
    const value = matches[1];
    if ( value != null ) { 
      sentTuningValue(value);
    }
  }
});

dialListener.on('listening', () => {
  const address = dialListener.address();
  console.log(`dialListener listening ${address.address}:${address.port}`);
});

dialListener.bind(8001);
// Prints: dialListener listening 0.0.0.0:41234

function sentTuningValue(tuningValue) {
  console.log("tuningValue ", tuningValue);
  const message = Buffer(1);
  message[0] = tuningValue < tunerPosition ? 4 : 5;
  const client = dgram.createSocket('udp4');
  console.log(`Sending message ${JSON.stringify(message)} to ${process.env.RADIO_HOSTNAME}:${process.env.RADIO_PORT}`)
  client.send(message, process.env.RADIO_PORT, process.env.RADIO_HOSTNAME, (err) => {
    if ( err ) {
      console.error("Error when sending packet", err)
    }
  });
}


console.log("finradio controller started");
