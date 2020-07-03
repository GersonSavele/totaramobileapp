import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";

global.console = {
  log: jest.fn(),
  error: console.error,
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

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
  ...require.requireActual("@apollo/react-hooks"),
  useApolloClient: jest.fn(() => ({
    readQuery: jest.fn(() => {}),
    writeQuery: jest.fn()
  }))
}));

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);

jest.mock("react-navigation", () => {
  return {
    withNavigation: jest.fn(),
    createAppContainer: jest
      .fn()
      // eslint-disable-next-line no-unused-vars
      .mockReturnValue(function NavigationContainer(props) {
        return null;
      }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    StackActions: {
      push: jest
        .fn()
        .mockImplementation((x) => ({ ...x, type: "Navigation/PUSH" })),
      replace: jest
        .fn()
        .mockImplementation((x) => ({ ...x, type: "Navigation/REPLACE" })),
      reset: jest.fn()
    },
    NavigationActions: {
      setParams: jest.fn(),
      navigate: jest.fn().mockImplementation((x) => x)
    }
  };
});
