# Totara App

React Native App

# Requirements

- node >= v13.7.0
- yarn >= 1.21.1
- React Native = 0.61.5
- Android SDK (API 28)
- XCode >= 11.3.1
- Cocoapods = 1.9.1

# Setup

### 1) Install [Yarn](https://yarnpkg.com/)

`brew install yarn`

## Twelve Factor setup

### Dev setup

Copy .env.sample and set your environment variables. These variables will be looked up in compile time.

### Beta setup

Copy .env.beta.sample and set your environment variables. These variables will be looked up in compile time.

### Beta SENTRY_PROJECT_URL

Go to client config section and choose the beta config : https://docs.sentry.io/clients/react-native/#configure

### Sentry setup(in case your project uses sentry)

Set your variables in `.env`. The main one is the SENTRY_AUTH_TOKEN. You can find it [here](https://sentry.io/settings/account/api/auth-tokens/)

## Firebase json file set up

You will need firebase to get Google services working, such as notifications. You will get it in your [Firebase account](https://console.firebase.google.com), according to your Application ID. Place `google-services.json` in `android/app` folder and `GoogleService-Info.plist` in `ios` folder.

# Build offline SCORM server script

Offline SCORM Server script should be bundled to "html" directory under "TotaraMobileOfflineScorm", it can be done using  
`yarn build_scorm` command

# Scripts

All the scripts are executed the following way: `yarn [script]`

### `ios`

Run iOS app: dev config.

### `android`

Run Android app: dev config.

### `ios-beta`

Run iOS app: beta config.

### `android-beta`

Run Android app: beta config.

# DevOps

## Beta job

You should set up the following variables:

- `SENTRY_PROJECT_URL`: Client config section: https://docs.sentry.io/clients/react-native/#configure
- `SENTRY_AUTH_TOKEN`: You can find it [here](https://sentry.io/settings/account/api/auth-tokens/)

# Contributing to the repository

## JavaScript (TypeScript) and Node

JavaScript should be readable, modular, and splittable. Take advantadge of functional programming and if you find business logic, generally put inside a utils file.

### Project Structure (for JS/Typescript/React Native)

We accept directories named with widgets group, for instance, buttons should be added to `components/buttons`, whenever possible.

We discourage name files "_feature_.component.js" or "_feature_.container.js".

### Formatting

We delegate that to [Prettier](https://prettier.io/).

Make sure your text editor has [that extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), and that it's configured to auto-format on save.

Here is a sample of settings.json file you can place in VSCode or your favourite IDE:

```
{
  "editor.tabSize": 2,
  "editor.formatOnSave": false,
  "[typescriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true
  },
  "[typescript]": {
      "editor.formatOnSave": true
  },
  "[javascriptreact]": {
      "editor.formatOnSave": true
  },
  "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true
  }
}
```

### License

This boilerplate is to be used on every file written by Totara Learning Solutions.

```
/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) {{year}} onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */
```

### Undefined and Null check

Javascript already has the `undefined` type to indicate the absence of value, so there is no need to have a second type that represent the same concept. Said that, avoid use of null. Yet sometime the server returns it, therefore you still have check.

```
//if the parameter is not a number, then this should be good
if ( param ) then ...

//if the parameter is a number, then we need to do this
if ( param !== null && param !== undefined ) then ...
```

### React components

Each component should have its own file preferably. Try to avoid lots of components in the same file. For instance:

```
//Button.tsx
const Button () => (
  <View><Icon name={iconName}/></View>
)

//This icon should be extracted so you promote reusability
const Icon = () => (<View />);

//nice default export
//we dont normally export two components
export default Button;
```

### Typescript interfaces and types

We use PascalCase

### Business logic/rules outside components

Business rules and logic, that can be encapsulated in pure functions, should be in `@totara/lib` module.

### Function parameters

Multiple arguments vs. options object

```
// bad
function exemple(nodeList, callback, thisObject, fromIndex, toIndex){
    ...
}

// good. That is better because it more readable when you call the function
function exemple({ nodeList, callback, thisObject, fromIndex, toIndex }){
    ...
}
```

### Modules

- Single component export default per file

# Troubleshooting

## When you switch branches and you suspect that there was native code changes(e.g: dependencies additions or upgrades)

Kill RN packger server. Run script `clear:all`. This will clean all the builds and caches on both Android and iOS. Then run your platform script.

## Detox Setup

- Install Node `8.3.0` or above

### Install Detox command line tools

- `detox-cli` should be installed globally

```sh
npm install -g detox-cli
```

### Clear cache data

- Run the following command to clear all the cache, modules && pods and reinstall.

```sh
yarn clear:all
```

### Build app

- Use a convenience method in Detox command line tools to build project

```sh
detox build
```

### Run the tests

- Use the Detox command line tools to test project:

```sh
detox test
```
