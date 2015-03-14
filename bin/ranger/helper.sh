#!/bin/bash


lowercase(){
	echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/";
}

OS=`lowercase \`uname\``
KERNEL=`uname -r`
MACH=`uname -m`


if [ "{$OS}" == "windowsnt" ]; then
	OS="windows";
elif [ "{$OS}" == "darwin" ]; then
	OS="osx";
elif [ "{$OS}" == "linux" ]; then
	OS="linux";
fi;


open_url() {

	url=$1;

	if [ "$OS" == "linux" ]; then
		$(xdg-open $url);
	elif [ "$OS" == "osx" ]; then
		$(open $url);
	fi;

}

open_url "$1";

