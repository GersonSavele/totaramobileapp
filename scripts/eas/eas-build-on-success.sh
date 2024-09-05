#!/bin/bash

if [[ "$EAS_BUILD_PROFILE" == "preview" && -n "$APPETIZE_API_KEY" ]]; then

  echo "Publish to Appetize"

  if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
    echo "iOS publish"

    APP_PATH="ios/build/Build/Products/Release-iphonesimulator/Totara.app"
    ZIP_PATH="ios/build/Build/Products/Release-iphonesimulator/application-totara.tar.gz"
    tar -czvf $ZIP_PATH $APP_PATH
    
    curl --http1.1 --header "Authorization: Basic $APPETIZE_API_KEY" "https://api.appetize.io/v1/apps/$APPETIZE_IOS_APP_PUBLIC_KEY" -F "file=@$ZIP_PATH" -F "fileType=tar.gz" -F "platform=ios"
  elif [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
    echo "Android publish"

    APP_PATH="android/app/build/outputs/apk/release/app-release.apk"

    curl --http1.1 --header "Authorization: Basic $APPETIZE_API_KEY" "https://api.appetize.io/v1/apps/$APPETIZE_ANDROID_APP_PUBLIC_KEY" -F "file=@$APP_PATH" -F "platform=android"
  fi

fi

if [[ -n "$SLACK_WEBHOOK_URL" ]]; then

  if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
    platform="iOS"
    emoji="🍏"

  elif [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
    platform="Android"
    emoji="🤖"
  fi

  artifact_url="https://expo.dev/accounts/abletech/projects/TotaraMobileApp/builds/$EAS_BUILD_ID"

  curl -X POST -H 'Content-type: application/json' --data "{
    \"blocks\": [
        {
            \"type\": \"section\",
            \"text\": {
                \"type\": \"mrkdwn\",
                \"text\": \"$emoji New Totara $platform build ready to be installed ($EAS_BUILD_PROFILE)\"
            }
        },
        {
            \"type\": \"actions\",
            \"elements\": [
                {
                    \"type\": \"button\",
                    \"text\": {
                        \"type\": \"plain_text\",
                        \"text\": \"Install\"
                    },
                    \"url\": \"$artifact_url\"
                }
            ]
        }
    ]
  }" $SLACK_WEBHOOK_URL

fi
