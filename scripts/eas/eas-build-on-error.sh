#!/bin/bash

SLACK_URL='https://hooks.slack.com/services/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'

if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  platform="iOS"

elif [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  platform="Android"
fi

curl -X POST -H 'Content-type: application/json' --data "{
  \"blocks\": [
      {
          \"type\": \"section\",
          \"text\": {
              \"type\": \"mrkdwn\",
              \"text\": \"🔴 Latest Totara $platform build failed. Check EAS for details\"
          }
      },
  ]
}" $SLACK_URL
