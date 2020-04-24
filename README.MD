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

> JavaScript should be readable, modular, and splittable.

### Project Structure (for JS/Typescript/React Native)

We accept directories named with widgets group, for instance, buttons should be added to `components/buttons`, whenever possible.

We discourage name files "_feature_.component.js" or "_feature_.container.js".

### Formatting

We delegate that to [Prettier](https://prettier.io/).

Make sure your text editor has [that extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), and that it's configured to auto-format on save.

### Modules

- single component export default per file

# Troubleshooting

## When you switch branches and you suspect that there was native code changes(e.g: dependencies additions or upgrades)

Kill RN packger server. Run script `clear:all`. This will clean all the builds and caches on both Android and iOS. Then run your platform script.
