#!/bin/bash

lowercase() {
	echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/";
}

OS=`lowercase \`uname\``;

LYCHEEJS_IOJS="";
LYCHEEJS_ROOT=$(cd "$(dirname "$0")/../"; pwd);
LYCHEEJS_SORBET="$LYCHEEJS_ROOT/bin/sorbet.sh";


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
				$LYCHEEJS_SORBET stop;
				$LYCHEEJS_SORBET start "$resource";

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

					if [ -e "/Applications/Google\ Chrome.app" ]; then
						browser="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome";
					elif [ -e "/Applications/Firefox.app" ]; then
						browser="/Applications/Firefox.app/Contents/MacOS/firefox";
					fi;

					if [ "$browser" != "" ]; then
						$browser "$resource" 2>&1;
						exit 0;
					else
						exit 1;
					fi;

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

