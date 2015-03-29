#!/bin/bash


osacompile -o ./helper.app ./helper.applescript;

cp ./helper/osx/Info.plist ./helper.app/Contents;
cp ./helper/osx/applet.icns ./helper.app/Contents/Resources/applet.icns;

open ./helper.app;

