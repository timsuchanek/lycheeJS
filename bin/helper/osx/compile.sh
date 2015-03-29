#!/bin/bash


BIN_ROOT=$(cd "$(dirname "$0")/../../"; pwd);

cd $BIN_ROOT;

osacompile -o ./helper.app ./helper/osx/helper.applescript;

cp ./helper/osx/Info.plist ./helper.app/Contents;
cp ./helper/osx/applet.icns ./helper.app/Contents/Resources/applet.icns;

