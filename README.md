# finradio

This is an initial prototype of the FinRadio app. Currently I'm interested in making a POC of the basic functions: learning how to tune the SDR, change the frequency, change the volume, explore software options, etc.


## Structure

Currently I'm using a modified version of the `rtl_fm` program called `rtl_udp` that provides a very simple protocol over UDP to change the tuner frequency, and that we can extend to send extra commands if we need to.

The sound is played through the audio out.

Another option I explored was running `rtl_tcp` to get the audio and control the tuner. See more details about this on <TBD SHOW AND TELL ENTRY>

Since I currently don't have integrated with the hardware knobs, I'm controlling the `rtl_udp` program using a simple node app located in [keyreader](./keyreader)


## Running

sudo balena scan

With a balenaFin:

```shell
Scanning for local balenaOS devices... Reporting scan results
- 
  host:          a4df9e9.local
  address:       192.168.0.32
  osVariant:     development
  dockerInfo: 
    Containers:        1
    ContainersRunning: 1
    ContainersPaused:  0
    ContainersStopped: 0
    Images:            2
    Driver:            aufs
    SystemTime:        2022-03-09T11:30:31.026799652Z
    KernelVersion:     5.10.31-v7
    OperatingSystem:   balenaOS 2021.10.2
    Architecture:      armv7l
  dockerVersion: 
    Version:    19.03.24
    ApiVersion: 1.40
```

Ok, we now want to push to the fleet:

```
ID      UUID    DEVICE NAME    DEVICE TYPE     FLEET                       STATUS IS ONLINE SUPERVISOR VERSION OS VERSION            DASHBOARD URL
5985982 8a8f2de fantastic-haze raspberrypi4-64 ramiro_gonzalez/bravo_1     Idle   false     12.11.0            balenaOS 2.87.16+rev1 https://dashboard.balena-cloud.com/devices/8a8f2de8ef47de5d4f744c585a99d922/summary
6138156 a4df9e9 frosty-pancake fincm3          ramiro_gonzalez/bravo_fin_2 Idle   true      12.10.3            balenaOS 2021.10.2    https://dashboard.balena-cloud.com/devices/a4df9e91e710a9339e5e5e8f8a93d59c/summary
```

Let's push to the `bravo_fin_2` fleet

```shell
balena push bravo_fin_2
```

You'll see a looong log of docker building the image the first time; next ones most of it would be cached.

If you see a unicorn then we're good

```
[Info]     Uploading images
[Success]  Successfully uploaded images
[Info]     Built on arm02
[Success]  Release successfully created!
[Info]     Release: bcb162df5f2c2b46e4c1db1533a73d0c (id: 2098216)
[Info]     ┌─────────┬────────────┬───────────────────────┐
[Info]     │ Service │ Image Size │ Build Time            │
[Info]     ├─────────┼────────────┼───────────────────────┤
[Info]     │ main    │ 590.77 MB  │ 2 minutes, 41 seconds │
[Info]     └─────────┴────────────┴───────────────────────┘
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
[ramiro@MBP2019:~/palomonte/github/ramirogm/finradio on main]
```


