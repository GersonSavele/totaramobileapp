import { TotaraTheme } from "@totara/theme/Theme";
import { NavigationStackOptions } from "react-navigation-stack";

type navigationOptionsProps = {
  title?: string;
  backTitle?: string;
  opacity?: number;
  rightAction?: JSX.Element;
  leftAction?: JSX.Element;
};

const TotaraNavigationOptions = ({
  opacity,
  title,
  rightAction,
  leftAction
}: navigationOptionsProps) => {
  const options = {
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: TotaraTheme.colorSecondary1,
      shadowOpacity: 0,
      elevation: 0
    },
    headerTitleStyle: {
      color: TotaraTheme.navigationHeaderTintColor,
      fontSize: TotaraTheme.textRegular.fontSize,
      opacity: opacity
    },
    title: title,
    headerBackTitle: null,
    headerTintColor: TotaraTheme.navigationHeaderTintColor,
    headerRight: rightAction,
    headerLeft: leftAction
  };
  return options as NavigationStackOptions;
};

export default TotaraNavigationOptions;
