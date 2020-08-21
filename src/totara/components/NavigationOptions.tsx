/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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

import { NavigationStackOptions } from "react-navigation-stack";

import { TotaraTheme } from "@totara/theme/Theme";

type navigationOptionsProps = {
  title?: string;
  backTitle?: string;
  opacity?: number;
  rightAction?: JSX.Element;
  leftAction?: JSX.Element;
};

const TotaraNavigationOptions = ({ opacity, title, rightAction, leftAction }: navigationOptionsProps) => {
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
