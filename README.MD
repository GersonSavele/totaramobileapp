# Totara App

React Native App

Please avoid adding content here, because it is better to keep one single documentation(https://totara.atlassian.net/wiki/spaces/DEV/pages/121185059/Getting+started+with+the+Totara+Mobile+app)

# Build offline SCORM server script

The offline SCORM server set up is not required to be updated normally, but if it is the case, its script should be bundled to "html" directory under "TotaraMobileOfflineScorm", it can be done using  
`npm run build_scorm` command

## Detox Setup

- Install Node `8.3.0` or above

### Install Detox command line tools

- `detox-cli` should be installed globally

```sh
npm install -g detox-cli
```

### Build and Run the tests

Use the following command to build and run the detox automated test

```sh
npm run detox:run
```
