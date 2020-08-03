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
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import React, { ReactNode } from "react";
import { View, StyleSheet, Text, Image, ImageSourcePropType } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { TotaraTheme } from "@totara/theme/Theme";
import { margins, modalSize, paddings } from "@totara/theme/constants";

type InfoContentParams = {
  title?: string;
  description?: string;
  imageSource: ImageSourcePropType;
  children?: ReactNode;
};

const ModalContent = ({ title, description, children, imageSource }: InfoContentParams) => {
  return (
    <View style={styles.transparentViewStyle}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "always" }}>
        <View style={[styles.containerStyle, { backgroundColor: TotaraTheme.colorNeutral1 }]}>
          <View style={styles.sectionContainer}>
            {imageSource && <Image style={styles.infoImage} source={imageSource} />}
          </View>
          <View style={styles.sectionContainer}>
            {(title && <Text style={{ ...TotaraTheme.textH2, ...styles.infoText }}>{title}</Text>) || null}
            {(description && <Text style={{ ...TotaraTheme.textRegular, ...styles.infoText }}>{description}</Text>) ||
              null}
          </View>
          <View style={styles.actionContainer}>{children}</View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: TotaraTheme.colorOpacity70,
    flexDirection: "row",
    alignItems: "center"
  },
  containerStyle: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: margins.marginXL,
    marginVertical: margins.margin3XL,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  sectionContainer: {
    marginVertical: margins.marginL,
    marginHorizontal: margins.marginXL,
    alignItems: "center"
  },
  actionContainer: {
    marginVertical: margins.marginL,
    minHeight: 104,
    justifyContent: "space-between"
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
