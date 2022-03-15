// From https://www.npmjs.com/package/oled-i2c-bus
// this is for monochrome screens
// Mine ( https://articulo.mercadolibre.com.ar/MLA-743257264-pantalla-oled-display-096p-arduino-raspberry-arm-i2c-iic-se-_JM?quantity=1 )
// is monochrome BUT it has the top +- 30 pixels yellow, and the rest blue

// To try:
// https://www.npmjs.com/package/oled-ssd1306-i2c


var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');

var font = require('oled-font-5x7');

var opts = {
  width: 128,
  height: 64,
  address: 0x3C
};

var oled = new oled(i2cBus, opts);



function startDisplay() {
  oled.turnOnDisplay();
  oled.clearDisplay();    
  oled.setCursor(1, 1);
  oled.writeString(font, 2, 'FinRadio', 1, false);
}

function displayFrequency(freqInMhz) {
  oled.setCursor(1, 30);
  const msg = ( freqInMhz < 100 ? " " : "" ) + freqInMhz.toFixed(2) + " Mhz";
  oled.writeString(font, 2, msg, 1, false);
}

// draws 4 white pixels total
// format: [x, y, color]
// oled.drawPixel([
// 	[128, 1, 1],
// 	[128, 32, 1],
// 	[128, 16, 1],
// 	[64, 16, 1]
// ]);

// oled.fillRect(1, 1, 128, 64, 1);

// oled.drawLine(1, 1, 128, 32, 1);

module.exports = {
  startDisplay,
  displayFrequency
}