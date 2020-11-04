#!/bin/bash
shopt -s expand_aliases

LANGUAGE_FOLDER="$PWD/src/totara/locale/languages/"
JQFOLDER="$PWD/node_modules/node-jq/bin/jq"
SERVER_URL="https://download.totaralms.com/lang/T13/"
RESOURCE_FILE_NAME="mobile.json.zip"

alias jq=$JQFOLDER

echo "Downloading translations from $SERVER_URL$RESOURCE_FILE_NAME"

cd "$LANGUAGE_FOLDER" && \

#Download file into current directory (add -s lowercase for silent, -S upper case for --show-error)
curl -S "$SERVER_URL$RESOURCE_FILE_NAME" > "$RESOURCE_FILE_NAME" && \

#Unzip the resource zip file overriding existing files (-o)
unzip -o "$RESOURCE_FILE_NAME" && \

#Delete the resource zip file as all files were unzipped and we dont need it anymore
rm "$RESOURCE_FILE_NAME" && \

#join all jsons into the all.json
echo "Generating all.json file"
jq -n '
  [inputs
   | {(input_filename | gsub(".*/|\\.json$";"")): .}]
  | add' *.json > all.json