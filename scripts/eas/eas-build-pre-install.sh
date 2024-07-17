#!/bin/bash

# Install cmake as required for the react-native-static-server library
if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  apt-get install --yes cmake
elif [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  HOMEBREW_NO_AUTO_UPDATE=1 brew install cmake
fi

# Download locale translations for the build
npm run translations