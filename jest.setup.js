jest.mock("@react-native-community/cookies", () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
    clearAll: jest.fn()
  };
});

jest.mock("react-navigation", () => {
  return {
    withNavigation: jest.fn(),
    NavigationParams: jest.fn(),
    NavigationInjectedProps: jest.fn()
  };
});

jest.mock("react-native-reanimated", () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn()
  };
});

jest.mock("react-native-gesture-handler", () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn()
  };
});

jest.mock("react-navigation-stack", () => {
  return {
    createStackNavigator: jest.fn()
  };
});

jest.mock("react-native-device-info", () => {
  return {
    getVersion: jest.fn(() => {
      return "UnknownVersion";
    }),
    getBuildNumber: jest.fn()
  };
});

jest.mock("@apollo/react-hooks", () => ({
  readQuery: jest.fn(),
  writeQuery: jest.fn()
}));
