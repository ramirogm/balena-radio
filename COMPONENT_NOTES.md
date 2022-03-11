https://gitlab.com/slepp/rtlmux
    allows multiple clients


demodulator?
Example DSP commands:
  * Compress I/Q data with FLAC:
    flac --force-raw-format --channels 2 --sample-rate=250000 --sign=unsigned --bps=8 --endian=little -o - -
  * Decompress FLAC-coded I/Q data:
    flac --force-raw-format --decode --endian=little --sign=unsigned - -



Rtl_fm is a general purpose analog demodulator. It can handle FM, AM and SSB. It can scan more than a hundred frequencies a second.
    For digital modes, piping the audio into multimon-ng works very well.
        http://eliasoenal.com/2012/05/24/multimonng/
    I'll be using Sox's play command to play the audio.


rtl_fm -M wbfm -f 89.1M | play -r 32k -t raw -e s -b 16 -c 1 -V1 -
which is:
rtl_fm -f 89.1M -M fm -s 170k -A fast -r 32k -l 0 -E deemp | play -r 32k -t raw -e s -b 16 -c 1 -V1 -

-M fm means narrowband FM
-s 170k means to sample the radio at 170k/sec
-A fast uses a fast polynominal approximation of arctangent
-r 32k means to lowpass/resample at 32kHz
-l 0 disables squelch
-E deemp applies a deemphesis filter


Or the output can be: sox -traw -r24k -es -b16 -c1 -V1 - -tmp3 - |






