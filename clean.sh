#!/bin/bash

HAS_YARN=$(which yarn)

# delete
echo "clearing watchman watches.. 💂"
watchman watch-del-all
echo "And now his watch has ended."
echo "Removing $TMPDIR/react-*"
rm -rf $TMPDIR/react-*
echo "Removing node_modules"
rm -rf node_modules
echo "cleaning android build"
(cd android && ./gradlew clean)
echo "✨✨✨✨✨✨✨ all clean now ❇︎❇︎❇︎❇︎❇︎❇︎❇︎"

# reinstall
if [ -n "$HAS_YARN" ]; then
  echo "Using yarn for blazing speeds 🚀"
  yarn install
else
  echo "Using good 'ol npm 🐌"
  npm install 1>/dev/null
fi
