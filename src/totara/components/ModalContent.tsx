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
import { View, StyleSheet, Text, Image, Dimensions, ImageSourcePropType } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { resizeByScreenSize } from "@totara/theme";
import { TotaraTheme } from "@totara/theme/Theme";
import { Images } from "@resources/images";

type InfoContentParams = {
  title?: string;
  description?: string;
  imageType: string;
  children?: ReactNode;
};

const {
  completeAction,
  urlNotValid,
  generalError,
  browserLogin,
  courseComplete,
  selfCompletion,
  courseCompatible,
  attemptComplete
} = Images;

const ModalContent = ({ title, description, imageType, children }: InfoContentParams) => {
  const getImageByType = () => ({
    complete_action: completeAction,
    url_not_valid: urlNotValid,
    general_error: generalError,
    browser_login: browserLogin,
    course_complete: courseComplete,
    self_completion: selfCompletion,
    course_compatible: courseCompatible,
    attempt_complete: attemptComplete
  });

  const modalImage = getImageByType()[imageType];

  return (
    <View style={styles.transparentViewStyle}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: "always" }}>
        <View style={[styles.containerStyle, { backgroundColor: TotaraTheme.colorNeutral1 }]}>
          <View style={styles.sectionContainer}>
            {modalImage && <Image style={styles.infoImage} source={modalImage as ImageSourcePropType} />}
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
    backgroundColor: TotaraTheme.colorOpacity70
  },
  containerStyle: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: resizeByScreenSize(16, 16, 20, 20),
    marginVertical: resizeByScreenSize(32, 32, 32, 32),
    flexDirection: "column",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center",
    justifyContent: "center"
  },
  sectionContainer: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    marginHorizontal: resizeByScreenSize(16, 24, 32, 32),
    alignItems: "center"
  },
  actionContainer: {
    marginVertical: resizeByScreenSize(8, 8, 16, 16),
    minHeight: 104,
    justifyContent: "space-between"
  },
  infoImage: {
    alignItems: "center",
    height: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").width * 0.7,
    resizeMode: "contain"
  },
  infoText: {
    color: TotaraTheme.textColorDark,
    textAlign: "center",
    paddingBottom: resizeByScreenSize(8, 8, 16, 16)
  }
});
export default ModalContent;
