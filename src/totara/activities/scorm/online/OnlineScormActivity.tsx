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

import React, { useEffect } from "react";
import { Text, BackHandler, View } from "react-native";

import { AuthenticatedWebView } from "@totara/auth";
import { translate } from "@totara/locale";
import { NavigationStackProp } from "react-navigation-stack";
import { onlineScormActivityStyles } from "@totara/theme/scorm";
import { TEST_ID } from "../constants";

type OnlineScormParams = {
  uri: string;
  backAction: () => void;
};

type OnlineScormProps = {
  navigation: NavigationStackProp<OnlineScormParams>;
};

const { INVALID_URL, ONLINE_PLAYER } = TEST_ID;

const OnlineScormActivity = ({ navigation }: OnlineScormProps) => {
  const { backAction, uri } = navigation.state.params as OnlineScormParams;
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [uri]);

  if (!uri)
    return (
      <Text testID={INVALID_URL}>{translate("general.error_unknown")}</Text>
    );
  return (
    <View
      style={onlineScormActivityStyles.playerContainer}
      testID={ONLINE_PLAYER}>
      <AuthenticatedWebView uri={uri} />
    </View>
  );
};

export default OnlineScormActivity;
