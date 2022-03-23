# keyreader 

Keyreader provides a fallback to users that don't have rotary knobs and still want to use Finradio. Keyreader reads key presses and sends commands using the same protocol as rotary knob does. It can be used together with rotary knobs as an alternative input

The reader can be configured using these environment variables:

| Env Var | Description | Default |
|:---|:----|:---|
| LISTENER_ADDRESS| Address where the datagrams are sent to | localhost |
| LISTENER_PORT| Port on that address| 8001 |
| LEFT_KEY| [name of the key](https://nodejs.org/api/readline.html#readline_rl_write_data_key) that represents rotating the knob counterclickwise | 'left' |
| RIGHT_KEY| same but for clockwise rotatiion | 'right' |
| PUSH_KEY| same but for pushing the knob | 'down'


The packet generated follow the one [documented on rotary-knob](https://github.com/ramirogm/rotary-knob#rotary-knob)

