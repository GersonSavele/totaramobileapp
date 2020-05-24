import { AppliedTheme } from "@totara/theme/Theme";

type navigationOptionsProps = {
  theme: AppliedTheme;
  title?: string;
  backTitle?: string;
  // rightIcon? : IconDefinition | string,
  opacity?: number;
  rightAction?: JSX.Element;
  leftAction?: JSX.Element;
};

const TotaraNavigationOptions = ({
  theme,
  opacity,
  title,
  rightAction,
  leftAction
}: navigationOptionsProps) => {
  return {
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: theme.colorSecondary1,
      shadowOpacity: 0,
      elevation: 0
    },
    headerTitleStyle: {
      color: theme.navigationHeaderTintColor,
      fontSize: theme.textH4.fontSize,
      opacity: opacity
    },
    title: title,
    headerBackTitle: null,
    headerTintColor: theme.navigationHeaderTintColor,
    headerRight: rightAction,
    headerLeft: leftAction
  };
};

export default TotaraNavigationOptions;
