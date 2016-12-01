#!/bin/bash
APP_BUILD_DATE=$(date +"%Y-%m-%d")
APP_NAME="tampereen-tapahtumat"

# Build a release apk
if [ "$1" = "--clean" ] || [ "$1" = "-C" ]; then
  echo "🔧 Cleaning the build.."
  (cd android && ./gradlew clean)
fi
echo "🔧  Building a release apk"
(cd android && ./gradlew assembleRelease)
echo "🔧  Release successfully built"
echo "current dir $(pwd)"

[ -d builds ] || mkdir builds
cp android/app/build/outputs/apk/app-release.apk ./builds/$APP_NAME-$APP_BUILD_DATE.apk
echo "🎉  Apk available at ./builds/$APP_NAME-$APP_BUILD_DATE.apk"
