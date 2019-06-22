#!/bin/sh

GATEWAY=$1

mosquitto_sub -t runner/cmd/# > CMDFIFO &

while [ 1 ]; do

	read MSG < CMDFIFO
	MAC=$(echo $MSG | cut -d ';' -f1)
	CMD=$(echo $MSG | cut -d ';' -f2)

	printf "\033[1;7;93mHTTP->\033[1;7;91mMQTT:\033[0m MAC: %8s - Cmd: \033[1;7;96m%1s\033[0m" $MAC $CMD
	printf " - $MAC;$CMD\n"

	if [ "$GATEWAY" != "ACM" ]; then
		echo "$MAC;$CMD" > $1
	fi

done