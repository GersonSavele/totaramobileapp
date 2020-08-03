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

import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import { iconSizes, paddings } from "@totara/theme/constants";

type SwitchOptionProps = {
  icon: any;
  selected: boolean;
  onPress(): void;
};

const SwitchOption = ({ icon, selected, onPress }: SwitchOptionProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[switchStyles.optionWidget, selected && switchStyles.optionWidgetSelected]}>
      <Image source={icon} style={[switchStyles.optionImage, selected && { tintColor: "black" }]} />
    </TouchableOpacity>
  );
};

type SwitchProps = {
  children: any;
};

const Switch = ({ children }: SwitchProps) => {
  return (
    <TouchableOpacity>
      <View style={switchStyles.container}>{children}</View>
    </TouchableOpacity>
  );
};

const switchStyles = StyleSheet.create({
  optionWidget: {
    height: iconSizes.sizeL,
    width: iconSizes.sizeL,
    borderRadius: iconSizes.sizeL / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  optionImage: {
    tintColor: "white"
  },
  optionWidgetSelected: {
    backgroundColor: "white"
  },
  optionWidgetIconSelected: {
    color: "white"
  },
  container: {
    flexDirection: "row",
    padding: paddings.paddingXS,
    borderRadius: iconSizes.sizeL / 2,
    backgroundColor: TotaraTheme.colorNeutral4
  }
});

export { Switch, SwitchOption };
