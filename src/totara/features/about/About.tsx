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

import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import { Images } from "@resources/images";
import { View } from "react-native-animatable";
import { TotaraTheme } from "@totara/theme/Theme";
import { paddings } from "@totara/theme/constants";
import { getBuildNumber, getVersion } from "react-native-device-info";

const About = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer} animation={"slideInUp"}>
        <Image source={Images.totaraLogo} style={styles.logo} />
      </View>
      <View style={styles.versionContainer} animation={"slideInUp"} delay={200}>
        <Text style={styles.version}>{`Version ${getVersion()} `}</Text>
        <Text style={styles.build}>{`(${getBuildNumber()})`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  logoContainer: { alignSelf: "center" },
  logo: {
    height: 120, //fixed for this view
    aspectRatio: 240 / 170 //using aspectRatio of logo_totara@2x.png
  },
  versionContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: paddings.padding2XL
  },
  version: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorNeutral6,
    alignSelf: "center"
  },
  build: {
    ...TotaraTheme.textSmall,
    color: TotaraTheme.colorNeutral6,
    alignSelf: "center"
  }
});

export default About;
