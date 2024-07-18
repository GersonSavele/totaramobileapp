#!/bin/bash

SLACK_URL='https://hooks.slack.com/services/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'

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
              \"text\": \"$emoji New Totara $platform build ready to be installed\"
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
}" $SLACK_URL
