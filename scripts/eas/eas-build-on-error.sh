#!/bin/bash

if [[ -n "$SLACK_WEBHOOK_URL" ]]; then

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
  }" $SLACK_WEBHOOK_URL

fi
