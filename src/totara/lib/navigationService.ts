import { NavigationActions } from "react-navigation";

let _navigator;

const setTopLevelNavigator = (navigatorRef) => {
  _navigator = navigatorRef;
};

const navigate = (routeName, params = undefined) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};

const topLevelNavigator = () => _navigator;

export default {
  navigate,
  setTopLevelNavigator,
  topLevelNavigator
};
