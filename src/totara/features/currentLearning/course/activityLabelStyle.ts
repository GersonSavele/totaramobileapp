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

import { StyleSheet } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";
import { margins, borderRadius, fontWeights } from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";
const { marginXS, marginM, margin2XL } = margins;

const activityLabelStyle = StyleSheet.create({
  container: {
    marginBottom: marginXS,
    justifyContent: "center",
    marginEnd: marginXS
  },
  labelWrap: {
    justifyContent: "center"
  },
  labelText: {
    textAlign: "left",
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorNeutral6
  },
  textLabeWrap: {
    justifyContent: "center"
  },
  videoTitle: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightBold,
    marginBottom: margin2XL,
    color: TotaraTheme.colorNeutral6
  },
  videoContainer: {
    maxWidth: deviceScreen.width,
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.borderRadiusM
  },
  videoDescription: {
    ...TotaraTheme.textRegular,
    marginTop: margin2XL,
    color: TotaraTheme.colorNeutral6
  },
  listContainer: {
    flexDirection: "row",
    marginRight: marginM,
    justifyContent: "flex-start"
  },
  textWrapViewContainer: {
    justifyContent: "center",
    marginBottom: margin2XL
  },
  imageContainer: {
    width: deviceScreen.width * 0.8,
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.borderRadiusM,
    alignSelf: "center",
    marginBottom: marginXS
  },
  list: {
    textAlign: "left",
    ...TotaraTheme.textRegular,
    marginRight: marginM,
    marginTop: marginM,
    color: TotaraTheme.colorNeutral6
  }
});

export default activityLabelStyle;
