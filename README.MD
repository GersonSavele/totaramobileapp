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
