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
 * */

import React, { ReactNode } from "react";
import { View, StyleSheet, Text, Image, ImageSourcePropType } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import { margins, modalSize, paddings, borderRadius } from "@totara/theme/constants";

type ModalContentProps = {
  title?: string;
  description?: string;
  imageSource: ImageSourcePropType;
  children?: ReactNode;
};

const ModalContent = ({ title, description, children, imageSource }: ModalContentProps) => {
  return (
    <View style={styles.transparentViewStyle}>
      <View style={styles.containerStyle}>
        <View style={styles.sectionContainer}>
          {imageSource && <Image style={styles.infoImage} source={imageSource} />}
        </View>
        <View style={styles.sectionContainer}>
          {(title && (
            <Text style={{ ...TotaraTheme.textH2, ...styles.infoText }} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
          )) ||
            null}
          {(description && (
            <Text style={{ ...TotaraTheme.textRegular, ...styles.infoText }} numberOfLines={3} ellipsizeMode="tail">
              {description}
            </Text>
          )) ||
            null}
        </View>
        <View style={styles.actionContainer}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    justifyContent: "center"
  },
  containerStyle: {
    borderRadius: borderRadius.borderRadiusXS,
    marginHorizontal: margins.marginXL,
    height: "70%",
    justifyContent: "center",
    backgroundColor: TotaraTheme.colorNeutral1
  },
  sectionContainer: {
    marginVertical: margins.marginL,
    marginHorizontal: margins.marginXL,
    alignItems: "center"
  },
  actionContainer: {
    marginVertical: margins.marginL,
    minHeight: 104,
    justifyContent: "space-between",
    alignSelf: "center"
  },
  infoImage: {
    alignItems: "center",
    width: modalSize.width,
    resizeMode: "contain"
  },
  infoText: {
    color: TotaraTheme.textColorDark,
    textAlign: "center",
    paddingBottom: paddings.paddingXL
  }
});

export default ModalContent;
