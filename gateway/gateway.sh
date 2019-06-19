#!/bin/sh

finish () {

	echo Exiting
	kill -9 $(ps aux | grep subscriber | grep -v grep | awk '{print $2}')
	kill -9 $(ps aux | grep publisher | grep -v grep | awk '{print $2}')
	killall mosquitto_sub
	exit 0

}

trap finish EXIT TERM INT

echo START

rm CMDFIFO
mkfifo CMDFIFO

if [ -f "/dev/ttyACM0" ]; then

	echo "Trabalhando com gateway real"
	GATEWAY="/dev/ttyACM0"

else

	echo "Trabalhando com gateway simulado"
	GATEWAY="ACM"
	if [ ! -e "ACM" ]; then
		mkfifo ACM
	fi

fi

./subscriber.sh ${GATEWAY} &

while [ 1 ]; do

	read MSG < ${GATEWAY}

	MAC=$(echo $MSG | cut -d ';' -f1)
	TEMP=$(echo $MSG | cut -d ';' -f2)
	FREQ=$(echo $MSG | cut -d ';' -f3)
	AMB=$(echo $MSG | cut -d ';' -f4)

	printf "\033[1;91mMQTT\033[0m->\033[1;93mHTTP\033[0m: MAC: %s - Temp: %5.2f - Freq: %5.2f - TAmb: %5.2f\n" $MAC $TEMP $FREQ $AMB

	mosquitto_pub -t "runner/info/${MAC}" -m "${TEMP}:${AMB}:${FREQ}"
	# mosquitto_pub -t "runner/freq/${MAC}" -m "${FREQ}"

done




