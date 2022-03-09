const dgram = require('dgram');
const Buffer = require('buffer').Buffer;


const RADIO_HOSTNAME = process.env["RADIO_HOSTNAME"] || "192.168.0.97";
const RADIO_PORT = process.env["RADIO_PORT"] || "6020";



const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


process.stdin.on('keypress', (str, key) => {

  if (key.ctrl && key.name === 'c') {
    process.kill(process.pid, 'SIGINT')
  }  
  console.log(str);
  console.log(key);
  if ( key.name == 'right' || key.name == 'left' ) {
    sendCommand(key.name);
  }
})


// Mouse events you said? Check https://github.com/TooTallNate/keypress


// 
function sendCommand(name) {
  const message = Buffer(1);
  message[0] = name == "left" ? 4 : name == "right" ? 5 : null;
  const client = dgram.createSocket('udp4');
  console.log(`Sending message ${JSON.stringify(message)} to ${RADIO_HOSTNAME}:${RADIO_PORT}`)
  client.send(message, RADIO_PORT, RADIO_HOSTNAME, (err) => {
    client.close();
  });

}



