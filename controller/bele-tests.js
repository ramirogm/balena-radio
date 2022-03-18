const Buffer = require('buffer').Buffer;


const buffer = Buffer.alloc(4);
const misteryBox = intToByteArray(1);
for (let i = 0; i < misteryBox.length; i++) {
    buffer[i] = misteryBox[i];
}

const be = buffer.readInt32BE(0);
const le = buffer.readInt32LE(0);
console.log(`i: ${1} be: ${be}  le: ${le}`);

const bufferLE = Buffer.alloc(4);
bufferLE.writeInt32LE(1, 0);
console.log(bufferLE.to);
console.log(misteryBox);


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

  


