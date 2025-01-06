# Totara App

React Native App

Please avoid adding content here, because it is better to keep one single documentation(https://totara.atlassian.net/wiki/spaces/DEV/pages/121185059/Getting+started+with+the+Totara+Mobile+app)

# Setup Files

```
cp src/totara/lib/config.local.example.ts src/totara/lib/config.local.ts

cp ios/GoogleService-Info.example.plist ios/GoogleService-Info.plist

cp android/app/google-services.example.json android/app/google-services.json

npm run //get schema
npm run //get languages
```

# Build offline SCORM server script

The offline SCORM server set up is not required to be updated normally, but if it is the case, its script should be bundled to "html" directory under "TotaraMobileOfflineScorm", it can be done using  
`npm run build_scorm` command
# totaramobileapp
