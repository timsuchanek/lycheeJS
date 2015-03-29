#!/bin/bash

lowercase() {
	echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/";
}

OS=`lowercase \`uname\``;

LYCHEEJS_IOJS="";
LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../"; pwd);


if [ "$OS" == "darwin" ]; then

	OS="osx";
	LYCHEEJS_IOJS="$LYCHEEJS_ROOT/bin/runtime/iojs/osx/iojs";

elif [ "$OS" == "linux" ]; then

	OS="linux";
	LYCHEEJS_IOJS="$LYCHEEJS_ROOT/bin/runtime/iojs/linux/iojs";

elif [ "$OS" == "windowsnt" ]; then

	OS="windows";
	LYCHEEJS_IOJS="$LYCHEEJS_ROOT/bin/runtime/iojs/windows/iojs.exe";

fi;



url=$1;
protocol=${url:0:8};

if [ "$protocol" == "lycheejs" ]; then

	tmp0=${url:11:4};
	tmp1=${url:11:4};
	tmp2=${url:11:3};

	application="";
	resource="";

	if [ "$tmp0" == "boot" ]; then
		application="boot";
		resource=${url#*=};
	fi;

	if [ "$tmp1" == "file" ]; then
		application="file";
		resource=${url#*=};
	fi;

	if [ "$tmp2" == "web" ]; then
		application="web";
		resource=${url#*=};
	fi;


	if [ "$application" != "" -a "$resource" != "" ]; then

		case "$application" in

			boot)

				cd $LYCHEEJS_ROOT;

				$LYCHEEJS_IOJS ./bin/sorbet.js stop;
				$LYCHEEJS_IOJS ./bin/sorbet.js start "$resource";

			;;

			file)

				if [ "$OS" == "linux" ]; then

					xdg-open "file://$resource" 2>&1;
					exit 0;

				elif [ "$OS" == "osx" ]; then

					open "file://$resource" 2>&1;
					exit 0;

				elif [ "$OS" == "windows" ]; then

					explorer "file://c:$resource";
					exit 0;

				fi;

			;;

			web)

				if [ "$OS" == "linux" ]; then

					xdg-open "$resource" 2>&1;
					exit 0;

				elif [ "$OS" == "osx" ]; then

					open "$resource" 2>&1;
					exit 0;

				elif [ "$OS" == "windows" ]; then

					# TODO: Figure out how to spawn correct Browser from Powershell
					exit 1;

				fi;

			;;

		esac;

	fi;


	exit 0;

else

	exit 1;

fi;

