/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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

import React, { useContext } from "react";
import { Text, ViewStyle, StyleSheet, TextStyle, ActivityIndicator } from "react-native";
import { Button } from "native-base";

import Icon, { IconName } from "@totara/components/Icon";
import { gutter, ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { borderRadius, paddings } from "@totara/theme/constants";

type PrimaryButtonProps = {
  children?: Element;
  text?: string;
  icon?: IconName;
  style?: ViewStyle;
  onPress?: () => void;
  mode?: "disabled" | "loading" | undefined;
  testID?: string;
};

type TitleProps = {
  text?: string;
  style?: TextStyle;
  mode?: "disabled" | "loading" | undefined;
};

type IndicatorProps = {
  icon?: IconName;
  mode?: "disabled" | "loading" | undefined;
  color?: string;
  size?: number;
};

const ButtonTitle = ({ mode, text, style }: TitleProps) => {
  switch (mode) {
    case "loading":
      return <Text style={style}>{translate("general.loading")}</Text>;
    default:
      return <Text style={style}>{text}</Text>;
  }
};

const ButtonIndicator = ({ mode, icon, color, size }: IndicatorProps) => {
  const styleIndicator = { marginLeft: gutter };
  switch (mode) {
    case "loading":
      return <ActivityIndicator size="small" color={color} style={styleIndicator} />;
    default:
      return icon ? <Icon name={icon} size={size} color={color} style={styleIndicator} /> : null;
  }
};

const PrimaryButton = ({ children, text, icon, style, onPress, mode, testID, ...rest }: PrimaryButtonProps) => {
  const theme = useContext(ThemeContext);

  const buttonStyle = StyleSheet.create({
    container: {
      height: 48,
      paddingHorizontal: paddings.paddingXL,
      minWidth: 150,
      borderRadius: borderRadius.borderRadiusXS,
      backgroundColor: theme.colorPrimary,
      opacity: mode == "loading" || mode == "disabled" ? 0.5 : 1
    },
    title: {
      fontWeight: "bold",
      fontSize: theme.textSmall.fontSize,
      color: theme.colorText
    }
  });

  return (
    // TODO Fix block should mean full width
    <Button
      // block
      testID={testID}
      onPress={onPress}
      {...rest}
      style={[buttonStyle.container, style]}
      disabled={mode == "loading" || mode == "disabled"}>
      {text ? <ButtonTitle mode={mode} text={text} style={buttonStyle.title} /> : <>{children}</>}
      <ButtonIndicator mode={mode} icon={icon} color={theme.colorText} size={theme.textSmall.fontSize} />
    </Button>
  );
};

export default PrimaryButton;
