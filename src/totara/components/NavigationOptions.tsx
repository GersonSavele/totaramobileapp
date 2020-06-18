import { TotaraTheme } from "@totara/theme/Theme";

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
  return {
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
};

export default TotaraNavigationOptions;
