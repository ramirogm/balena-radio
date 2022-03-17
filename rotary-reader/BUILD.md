# Building

Building locally


% balena build -f bravo_fin_2 --noparent-check                                                                                                                                 
[Info]    No "docker-compose.yml" file found at "/Users/ramiro/palomonte/github/ramirogm/finradio/rotary-reader"
[Info]    Creating default composition with source: "/Users/ramiro/palomonte/github/ramirogm/finradio/rotary-reader"
[Build]   Building services...
[Build]   main Preparing...
[Info]    Building for armv7hf/fincm3
[Info]    Docker Desktop detected (daemon architecture: "x86_64")
[Info]      Docker itself will determine and enable architecture emulation if required,
[Info]      without balena-cli intervention and regardless of the --emulated option.
[Build]   main Step 1/8 : FROM balenalib/fincm3-node:16-bullseye-build
[Build]   main  ---> f29051c7153f
[Build]   main Step 2/8 : ENV CACHE_BUSTER v.0.0.1
[Build]   main  ---> [Warning] The requested image's platform (linux/arm/v7) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in d2bd955a4a69
[Build]   main Removing intermediate container d2bd955a4a69
[Build]   main  ---> 17d8ecfebcc4
[Build]   main Step 3/8 : WORKDIR /usr/src/app
[Build]   main  ---> [Warning] The requested image's platform (linux/arm/v7) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 07030d15ab81
[Build]   main Removing intermediate container 07030d15ab81
[Build]   main  ---> fcc8d51416d8
[Build]   main Step 4/8 : COPY package*.json ./
[Build]   main  ---> 5443eb9f78ae
[Build]   main Step 5/8 : RUN JOBS=MAX npm install --production --unsafe-perm && npm cache verify && rm -rf /tmp/*
[Build]   main  ---> [Warning] The requested image's platform (linux/arm/v7) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 2f1833481bd9
[Build]   main Here are a few details about this Docker image (For more information please visit https://www.balena.io/docs/reference/base-images/base-images/): 
[Build]   main Architecture: ARM v7 
[Build]   main OS: Debian Bullseye 
[Build]   main Variant: build variant 
[Build]   main Default variable(s): UDEV=off 
[Build]   main The following software stack is preinstalled: 
[Build]   main Node.js v16.14.0, Yarn v1.22.4 
[Build]   main Extra features: 
[Build]   main - Easy way to install packages with `install_packages <package-name>` command 
[Build]   main - Run anywhere with cross-build feature  (for ARM only) 
[Build]   main - Keep the container idling with `balena-idle` command 
[Build]   main - Show base image details with `balena-info` command
[Build]   main added 7 packages, and audited 8 packages in 35s
[Build]   main found 0 vulnerabilities
[Build]   main npm notice 
[Build]   main npm notice New minor version of npm available! 8.3.1 -> 8.5.4
[Build]   main npm notice Changelog: <https://github.com/npm/cli/releases/tag/v8.5.4>
[Build]   main npm notice Run `npm install -g npm@8.5.4` to update!
[Build]   main npm notice 
[Build]   main Cache verified and compressed (~/.npm/_cacache)
[Build]   main Content verified: 15 (2229921 bytes)
[Build]   main Index entries: 15
[Build]   main Finished in 0.739s
[Build]   main Removing intermediate container 2f1833481bd9
[Build]   main  ---> 5b87b83faa7f
[Build]   main Step 6/8 : COPY . ./
[Build]   main  ---> 83bd15f51d5c
[Build]   main Step 7/8 : ENV UDEV=1
[Build]   main  ---> [Warning] The requested image's platform (linux/arm/v7) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 25e9bcaa512b
[Build]   main Removing intermediate container 25e9bcaa512b
[Build]   main  ---> b2b83dc48d7d
[Build]   main Step 8/8 : CMD ["npm", "start"]
[Build]   main  ---> [Warning] The requested image's platform (linux/arm/v7) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 553701d48a11
[Build]   main Removing intermediate container 553701d48a11
[Build]   main  ---> 90cbaa8d621c
[Build]   main Successfully built 90cbaa8d621c
[Build]   main Successfully tagged rotary-reader_main:latest
[Build]   main Image size: 633.47 MB
[Build]   Built 1 service in 3:02
[Success] Build succeeded!


docker tag rotary-reader_main:latest rotary-reader_main:armv7hf-latest
docker tag rotary-reader_main:latest rotary-reader_main:fincm3-latest




% balena build -f bravo_1 --noparent-check                                                                                                                                         


[Info]    No "docker-compose.yml" file found at "/Users/ramiro/palomonte/github/ramirogm/finradio/rotary-reader"
[Info]    Creating default composition with source: "/Users/ramiro/palomonte/github/ramirogm/finradio/rotary-reader"
[Build]   Building services...
[Build]   main Preparing...
[Info]    Building for aarch64/raspberrypi4-64
[Info]    Docker Desktop detected (daemon architecture: "x86_64")
[Info]      Docker itself will determine and enable architecture emulation if required,
[Info]      without balena-cli intervention and regardless of the --emulated option.


[Build]   main Step 1/8 : FROM balenalib/raspberrypi4-64-node:16-bullseye-build
[Build]   main  ---> ced777467055
[Build]   main Step 2/8 : ENV CACHE_BUSTER v.0.0.1
[Build]   main  ---> [Warning] The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 0dd323065cd1
[Build]   main Removing intermediate container 0dd323065cd1
[Build]   main  ---> 38df9efe0bf6
[Build]   main Step 3/8 : WORKDIR /usr/src/app
[Build]   main  ---> [Warning] The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in ba1951cdf143
[Build]   main Removing intermediate container ba1951cdf143
[Build]   main  ---> f7116ad36ca4
[Build]   main Step 4/8 : COPY package*.json ./
[Build]   main  ---> d2c9dc22ccaf
[Build]   main Step 5/8 : RUN JOBS=MAX npm install --production --unsafe-perm && npm cache verify && rm -rf /tmp/*
[Build]   main  ---> [Warning] The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 622591fc7147
[Build]   main Here are a few details about this Docker image (For more information please visit https://www.balena.io/docs/reference/base-images/base-images/): 
[Build]   main Architecture: ARM v8 
[Build]   main OS: Debian Bullseye 
[Build]   main Variant: build variant 
[Build]   main Default variable(s): UDEV=off 
[Build]   main The following software stack is preinstalled: 
[Build]   main Node.js v16.14.0, Yarn v1.22.4 
[Build]   main Extra features: 
[Build]   main - Easy way to install packages with `install_packages <package-name>` command 
[Build]   main - Run anywhere with cross-build feature  (for ARM only) 
[Build]   main - Keep the container idling with `balena-idle` command 
[Build]   main - Show base image details with `balena-info` command
[Build]   main added 7 packages, and audited 8 packages in 34s
[Build]   main found 0 vulnerabilities
[Build]   main npm notice 
[Build]   main npm notice New minor version of npm available! 8.3.1 -> 8.5.4
[Build]   main npm notice Changelog: <https://github.com/npm/cli/releases/tag/v8.5.4>
[Build]   main npm notice Run `npm install -g npm@8.5.4` to update!
[Build]   main npm notice 
[Build]   main Cache verified and compressed (~/.npm/_cacache)
[Build]   main Content verified: 15 (2229921 bytes)
[Build]   main Index entries: 15
[Build]   main Finished in 0.918s
[Build]   main Removing intermediate container 622591fc7147
[Build]   main  ---> 6768c2025839
[Build]   main Step 6/8 : COPY . ./
[Build]   main  ---> 240c0c6fd5eb
[Build]   main Step 7/8 : ENV UDEV=1
[Build]   main  ---> [Warning] The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 95b8921837c3
[Build]   main Removing intermediate container 95b8921837c3
[Build]   main  ---> 0137df4f0558
[Build]   main Step 8/8 : CMD ["npm", "start"]
[Build]   main  ---> [Warning] The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested
[Build]   main  ---> Running in 924123ebd319
[Build]   main Removing intermediate container 924123ebd319
[Build]   main  ---> 53c424ad9de4
[Build]   main Successfully built 53c424ad9de4
[Build]   main Successfully tagged rotary-reader_main:latest
[Build]   main Image size: 779.52 MB
[Build]   Built 1 service in 2:55
[Success] Build succeeded!


docker tag rotary-reader_main:latest rotary-reader_main:aarch64-latest
docker tag rotary-reader_main:latest rotary-reader_main:raspberrypi4-64-latest



rotary-reader_main                                                       aarch64-latest           53c424ad9de4   5 minutes ago   817MB
rotary-reader_main                                                       raspberrypi4-64-latest   53c424ad9de4   5 minutes ago   817MB
rotary-reader_main                                                       armv7hf-latest           90cbaa8d621c   9 minutes ago   664MB
rotary-reader_main                                                       fincm3-latest            90cbaa8d621c   9 minutes ago   664MB
rotary-reader_main                                                       latest                   90cbaa8d621c   9 minutes ago   664MB


docker tag rotary-reader_main:aarch64-latest ramirogmbalena/rotary-reader:aarch64-latest
docker tag rotary-reader_main:raspberrypi4-64-latest ramirogmbalena/rotary-reader:raspberrypi4-64-latest
docker tag rotary-reader_main:armv7hf-latest ramirogmbalena/rotary-reader:armv7hf-latest
docker tag rotary-reader_main:fincm3-latest ramirogmbalena/rotary-reader:fincm3-latest

docker push ramirogmbalena/rotary-reader:aarch64-latest
docker push ramirogmbalena/rotary-reader:raspberrypi4-64-latest
docker push ramirogmbalena/rotary-reader:armv7hf-latest
docker push ramirogmbalena/rotary-reader:fincm3-latest


///////


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

