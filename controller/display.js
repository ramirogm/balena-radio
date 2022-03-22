// From https://www.npmjs.com/package/oled-i2c-bus
// this is for monochrome screens
// Mine ( https://articulo.mercadolibre.com.ar/MLA-743257264-pantalla-oled-display-096p-arduino-raspberry-arm-i2c-iic-se-_JM?quantity=1 )
// is monochrome BUT it has the top +- 30 pixels yellow, and the rest blue
//
// Fonts: Get them from https://www.npmjs.com/package/oled-font-pack
//


const i2c = require('i2c-bus');
const oled = require('oled-i2c-bus');

const font = require('oled-font-5x7');

const opts = {
  width: 128,
  height: 64,
  address: 0x3C
};

var oledDisplay;

function startDisplay() {
  const i2cBus = i2c.openSync(1);
  oledDisplay = new oled(i2cBus, opts);
  oledDisplay.turnOnDisplay();
  oledDisplay.clearDisplay();    
  oledDisplay.setCursor(1, 1);
  oledDisplay.writeString(font, 2, 'FinRadio', 1, false);
}

function displayFrequency(freqInMhz) {
  oledDisplay.setCursor(1, 30);
  const msg = ( freqInMhz < 100 ? " " : "" ) + freqInMhz.toFixed(2) + " Mhz";
  oledDisplay.writeString(font, 2, msg, 1, false);
}

module.exports = {
  startDisplay,
  displayFrequency
}