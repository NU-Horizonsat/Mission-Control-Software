#!/bin/bash
# Start greenctld for RT-21
# This listens on TCP 4533 by default and
# emulates a 'rotctld'-like interface.

BAUD=${BAUD:-9600}
AZ_PORT="/dev/ttyUSB0"
EL_PORT="/dev/ttyUSB1"
TCP_PORT=4533

echo "Starting greenctld with AZ=$AZ_PORT EL=$EL_PORT SPEED=$BAUD"
exec ./greenctld \
  --az-device $AZ_PORT \
  --el-device $EL_PORT \
  --speed $BAUD \
  --port $TCP_PORT
