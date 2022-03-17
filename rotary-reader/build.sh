balena build -f bravo_fin_2 --noparent-check \
&& docker tag rotary-reader_main:latest rotary-reader_main:armv7hf-latest \
&& docker tag rotary-reader_main:latest rotary-reader_main:fincm3-latest \
&& balena build -f bravo_1 --noparent-check   \
&& docker tag rotary-reader_main:latest rotary-reader_main:aarch64-latest \
&& docker tag rotary-reader_main:latest rotary-reader_main:raspberrypi4-64-latest \
&& docker tag rotary-reader_main:aarch64-latest ramirogmbalena/rotary-reader:aarch64-latest \
&& docker tag rotary-reader_main:raspberrypi4-64-latest ramirogmbalena/rotary-reader:raspberrypi4-64-latest \
&& docker tag rotary-reader_main:armv7hf-latest ramirogmbalena/rotary-reader:armv7hf-latest \
&& docker tag rotary-reader_main:fincm3-latest ramirogmbalena/rotary-reader:fincm3-latest \
&& docker push ramirogmbalena/rotary-reader:aarch64-latest \
&& docker push ramirogmbalena/rotary-reader:raspberrypi4-64-latest \
&& docker push ramirogmbalena/rotary-reader:armv7hf-latest \
&& docker push ramirogmbalena/rotary-reader:fincm3-latest \
&& echo "Success!"
