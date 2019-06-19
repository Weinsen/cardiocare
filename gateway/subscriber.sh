#!/bin/sh

mosquitto_sub -t runner/cmd/# > CMDFIFO &

while [ 1 ]; do

	read MSG < CMDFIFO
	MAC=$(echo $MSG | cut -d ';' -f1)
	CMD=$(echo $MSG | cut -d ';' -f2)

	printf "\033[1;93mHTTP\033[0m->\033[1;91mMQTT\033[0m: MAC: %s - Cmd: \033[1;7;96m%s\033[0m" $MAC $CMD
	printf " - $MAC;$CMD\n"

done