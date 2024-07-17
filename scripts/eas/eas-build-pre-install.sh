#!/bin/bash

if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  apt-get install --yes cmake
elif [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  HOMEBREW_NO_AUTO_UPDATE=1 brew install cmake
fi