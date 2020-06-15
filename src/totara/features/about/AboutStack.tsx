/**
 *
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
 *
 */

import { createStackNavigator } from "react-navigation-stack";
import { TouchableIcon } from "@totara/components";
import { TotaraTheme } from "@totara/theme/Theme";
import React from "react";
import About from "@totara/features/about/About";

const AboutStack = createStackNavigator({
  About: {
    screen: About,
    navigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <TouchableIcon
            icon={"times"}
            onPress={() => navigation.pop()}
            size={TotaraTheme.textH3.fontSize}
          />
        )
      };
    }
  }
});

export default AboutStack;
