#!/bin/bash

INSTALL=false
HAS_YARN=$(which yarn)
AVD_NAME="nexus_5_api_23_x86_64"
# TODO
# check avd name from list and maybe even let user pick
# or take from props

# check for install flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Runs the app, and installs it if not installed."
  echo "Can be forced  to install with --install or -I"
  exit 0
fi

# check for install flag
if [ "$1" = "--install" ] || [ "$1" = "-I" ] || [ ! -d "./node_modules" ]; then
  echo "install flag was set"
  INSTALL=true
fi

if [ $INSTALL = true ]; then
  echo "Installing... 🙏"
  if [ -n "$HAS_YARN" ]; then
    echo "Using yarn for blazing speeds 🚀"
    yarn install
  else
    echo "Using good 'ol npm 🐌"
    npm install 1>/dev/null
  fi
  echo "Install finished 🎉"
fi

echo "launching emulator 📱"
emulator -avd $AVD_NAME 1>/dev/null &
sleep 10s
echo "launching the packager 📦"
echo "running 🏃"
react-native run-android
