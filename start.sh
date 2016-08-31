#!/usr/bin/env bash

_ip=`ipconfig getifaddr en0`
echo "Current IP: ${_ip}"
WEBPACK_HOST=${_ip} npm start dev
