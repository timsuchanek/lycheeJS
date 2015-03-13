#!/bin/bash


lowercase(){
	echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/";
}

OS=`lowercase \`uname\``;
KERNEL=`uname -r`;
MACH=`uname -m`;

WEBBROWSER="";
FILEBROWSER="";



if [ "{$OS}" == "darwin" ]; then

	OS="osx";

	if [ -e "/Applications/Google\ Chrome.app" ]; then
		WEBBROWSER="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome";
	elif [ -e "/Applications/Firefox.app" ]; then
		WEBBROWSER="/Applications/Firefox.app/Contents/MacOS/firefox";
	fi;

elif [ "{$OS}" == "linux" ]; then

	OS="linux";

	if [ "`which chrome`" != "" ]; then
		WEBBROWSER=`which chrome`;
	elif [ "`which google-chrome`" != "" ]; then
		WEBBROWSER=`which google-chrome`;
	elif [ "`which firefox`" != "" ]; then
		WEBBROWSER=`which firefox`;
	fi;

fi;



_handle_url() {

	url=$1;
	protocol=${url:0:8};

	if [ "$protocol" == "lycheejs" ]; then

		tmp1=${url:11:4};
		tmp2=${url:11:3};

		application="";
		resource="";

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

				file)

					if [ "$OS" == "linux" ]; then
						xdg-open "file://$resource" 2>&1;
						exit 0;
					elif [ "$OS" == "osx" ]; then
						open "file://$resource" 2>&1;
						exit 0;
					fi;

				;;

				web)

					if [ "$OS" == "linux" ]; then
						$WEBBROWSER "$resource" 2>&1;
						exit 0;
					elif [ "$OS" == "osx" ]; then
						$WEBBROWSER "$resource" 2>&1;
						exit 0;
					fi;

				;;

			esac;

		fi;

	fi;

}



_handle_url "$1";



exit 1;

