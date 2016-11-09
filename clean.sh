#!/bin/bash

HAS_YARN=$(which yarn)

# delete
watchman watch-del-all
rm -rf $TMPDIR/react-*
rm -rf node_modules
(cd android && ./gradlew clean)

# reinstall
if [ -n "$HAS_YARN" ]; then
  echo "Using yarn for blazing speeds 🚀"
  yarn install
else
  echo "Using good 'ol npm 🐌"
  npm install 1>/dev/null
fi
