FROM balenalib/%%BALENA_MACHINE_NAME%%-ubuntu-python:3.7-bionic-build

WORKDIR /usr/src/app

RUN \
    apt-get update && apt-get install -y ttf-dejavu libfreetype6-dev

RUN \
    pip3 install pillow RPi.GPIO
    #  \
    # adafruit-circuitpython-rgb-display \
    # requests redis adafruit-circuitpython-seesaw

COPY *.py ./
# COPY *.ttf ./

CMD [ "python3", "controller.py" ]