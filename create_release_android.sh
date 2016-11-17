#!/bin/bash
# Build a release apk
echo "Building a release apk..."
(cd android && ./gradlew clean && ./gradlew assembleRelease)
echo "Release successfully built"
rm -f ./tampereen-tapahtumat.apk
cp android/app/build/outputs/apk/app-release.apk ./tampereen-tapahtumat.apk
echo "Apk available at ./tampereen-tapahtumat.apk 🎉"
