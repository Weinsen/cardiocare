#!/bin/sh

if [ -n $1 ]; then
	MAC=$1
else
	MAC="bb06"
fi

while [ 1 ]; do
	echo "$MAC;$(shuf -i 35-37 -n 1);$(shuf -i 90-110 -n 1);$(shuf -i 24-26 -n 1)" > ACM;
	sleep 1;
done