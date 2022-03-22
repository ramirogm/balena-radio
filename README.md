# finradio

With this app plus a Raspberry Pi and a RTL-SDR dobgle you can build a Radio Receiver to listen to FM Radio.

This app is the software side of FinRadio, a radio tuner with rotary knobs used to change the tuning frequency and output volume, and a small display that shows the current frequency.

As a minimum you need a Raspberry Pi + a SDR dongle, and you can use the keyboard to change the tuning frequency and output volume.

This project was done during the balenaLabs residency program. You can see more details in [the forum post I kept during the project](https://forums.balena.io/t/finradio-a-balenalabs-residency-project/354030/17)


## Components

The app is a multi-container balena app that uses:
 - 2 rotary-knob blocks to read from the volume and tuning knob
 - a containerized rtl_fm fork to listen to and control the radio tuner
 - a Node.js app that controls the other components and runs the display


![component diagram](./diagrams/FinRadio_v0.0.2.drawio.png)


Currently the apps uses a modified version of the `rtl_fm` program called `rtl_udp` that provides a very simple protocol over UDP to change the tuner frequency, and that we can extend to send extra commands if we need to.

The sound is played through the audio out.

The volume and tuning knobs are handled with a pair of [rotary-knob blocks](https://github.com/ramirogm/rotary-knob)

## Running the full version

Bill of materials:

* 2 rotary knobs
* 2 LEDs, one yellow, one green
* 2 resistors to avoid blowing up the LEDs
* 1 SSD1306 controlled OLED 128x64 display. See options below if you want to use something different
* Some kind of speakers connected to the Audio jack on the Raspberry Pi. Don't forget to turn the speakers on!.

And a supported device:

<table>
  <tr>
    <td>
<img height="24px" src="https://files.balena-cloud.com/images/fincm3/2.58.3%2Brev1.prod/logo.svg" alt="fincm3" style="max-width: 100%; margin: 0px 4px;"></td>
    <td> balenaFin</td>
    <td>You'd need to add an USB sound card to be able to play through an Audio Jack</td>
  </tr>
<tr><td>
<img height="24px" src="https://files.balena-cloud.com/images/raspberrypi3/2.58.3%2Brev1.prod/logo.svg" alt="raspberrypi3" style="max-width: 100%; margin: 0px 4px;"></td><td>Raspberry Pi 3 Model B+</td>
    <td>Not tested</td>
</tr>
<tr><td>
<img height="24px" src="https://files.balena-cloud.com/images/raspberrypi4-64/2.65.0%2Brev1.prod/logo.svg" alt="raspberrypi4-64" style="max-width: 100%; margin: 0px 4px;"></td><td>Raspberry Pi 4 Model B</td>
    <td>Tested</td>
</tr>
<tr><td>
<img height="24px" src="https://files.balena-cloud.com/images/raspberrypi400-64/2.65.0%2Brev2.prod/logo.svg" alt="raspberrypi4-400" style="max-width: 100%; margin: 0px 4px;"></td><td>Raspberry Pi 400</td>
    <td>You'd need to add an USB sound card to be able to play through an Audio Jack</td>
</tr>
</table>



### Wiring

For the full version, you need to wire the components according to the following diagram. If you change the GPIO pins take note so that you can later update the config using fleet variables or directly on `docker-compose.yaml`.

![component diagram](./diagrams/fritzing/finradio-v0.0.3_bb.png)

## Running

### If you already have a fleet

You need to create a fleet on your balena account and push this app to it.

For example, if you already have a fleet named `bravo_fin_2`:

Let's push to the `bravo_fin_2` fleet

```shell
balena push bravo_fin_2
```

You'll see a looong log of docker building the image the first time; next ones most of it would be cached.

If you see a unicorn then we're good! And after a minute or two you should be listening to the radio on your Pi!


```
[Info]     Build finished in 3 minutes, 17 seconds
                            \
                             \
                              \\
                               \\
                                >\/7
                            _.-(6'  \
                           (=___._/` \
                                )  \ |
                               /   / |
                              /    > /
                             j    < _\
                         _.-' :      ``.
                         \ r=._\        `.
                        <`\\_  \         .`-.
                         \ r-7  `-. ._  ' .  `\
                          \`,      `-.`7  7)   )
                           \/         \|  \'  / `-._
                                      ||    .'
                                       \\  (
                                        >\  >
                                    ,.-' >.'
                                   <.'_.''
                                     <'
```

### Creating and deploying to a fleet

All you need to do is click the deploy button below:

[![balena deploy button](https://www.balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/ramirogm/finradio)

## Deploying the fleet

<!--
You will then be lead to creating a fleet in the balena dashboard. Choose `Raspberry Pi 3 or 4B` as the default device type and then click `advanced` to further detail the configuration of the fleet. The [Usage and Customization](#usage-and-customization) section will explain all of the variables you see in the advanced page. You can change these values later on if you want to create the fleet first and worry about the configuration later.

![deploy-fleet](./images/deploy-fleet.png)

![deploy-fleet-advanced](./images/deploy-fleet-advanced.png)

After deploying the fleet, you should see something like this:
![fleet-dashboard](./images/fleet-dashboard.png)

Now, it's time to add your device(s) to the fleet. Press `add device` on the dashboard and then select how you want your device image to be configured. We suggest selecting the `development` edition for first time users so you can iterate and develop locally. Afterwards, connect your SD Card to your PC and press `flash` to flash the image.
![add-device](./images/add-device.png)

Insert the newly flashed SD card to your device, turn it on, and you should see it in the dashboard in a few minutes.

![deploy-sd](./images/deploy-sd.gif)

-->





## Hardware alternatives

### No rotary knobs

If you want to run the FinRadio without rotary knobs, then you could use the keyboard to change the tuning frequency and the volume

To do this, comment out the entries for `tuning-knob` and `volume-knob` and uncomment the entry for `keyreader`.

**FIXME add this container**

### No LED feedback pins

I think this works ok, it will output signals but nothing connected to the GPIO pints  **FIXME**



## Usage and Customization

### Customizing variables



### List of all environment variables

To edit these values in the dashboard, simply press `Variables` on the left column.


| Env Var | Description | Default |
|:---|:----|:---|
| RADIO_ENABLED| Run the radio demodulator. Disable if you don't have a tuner and want to try the other features like turning the volume knob, or are just testing | 1 |
| GREEN_GPIO_PIN|  GPIO pin # where the Green Led is connected to | 6 |
| YELLOW_GPIO_PIN |  GPIO pin # where the Green Led is connected to |26 |
| INITIAL_FREQUENCY_MHZ|  Initial tuner frequency, in Mhz| 101.9 |
| DISPLAY_TYPE | Must be I2C or NONE | I2C |


### environment variables that have to be changed through docker-compose

If you want to change the Tuning and Volume rotary knob pinouts, the you'd need to edit the `docker-compose.yaml`


