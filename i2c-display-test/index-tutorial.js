// from https://www.youtube.com/watch?v=98LPUqTTfjo
const i2c = require('i2c-bus');
const sleep = require('sleep');

const OLED_I2C_ADDRESS = 0x3C;
const I2C_BUS_NUMBER = 1;

const i2cBus = i2c.open(I2C_BUS_NUMBER, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});

