/**
 * This file is part of Totara Enterprise.
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

import React, { useContext, useEffect } from "react";
import { SafeAreaView, Text, BackHandler } from "react-native";

import { AuthenticatedWebView } from "@totara/auth";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { NavigationStackProp } from "react-navigation-stack";

type OnlineScormParams = {
  uri: string;
  backAction: Function;
};

type OnlineScormProps = {
  navigation: NavigationStackProp<OnlineScormParams>;
};

const OnlineSCORMActivity = ({ navigation }: OnlineScormProps) => {
  const { backAction, uri } = navigation.state.params as OnlineScormParams;
  const [theme] = useContext(ThemeContext);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [uri]);

  if (!uri) {
    return (
      <SafeAreaView>
        <Text>{translate("general.error_unknown")}</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <>
        <AuthenticatedWebView uri={uri} />
        <SafeAreaView
          style={{ backgroundColor: theme.viewContainer.backgroundColor }}
        />
      </>
    );
  }
};

export default OnlineSCORMActivity;
