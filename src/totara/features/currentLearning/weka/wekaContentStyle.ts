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
const { marginXS, marginM, marginS } = margins;

const wekaEditorStyle = StyleSheet.create({
  container: {
    marginBottom: marginXS,
    marginEnd: marginXS
  },
  docWrap: {
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  emoji: {
    textAlign: "left",
    ...TotaraTheme.textRegular,
    marginVertical: marginM
  },
  textContainerWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: marginS
  },
  linkMediaTitle: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightBold,
    marginTop: margins.marginXL,
    marginBottom: margins.marginM,
    color: TotaraTheme.colorFont
  },
  linkMediaContainer: {
    maxWidth: deviceScreen.width,
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.borderRadiusM
  },
  linkMediaDescription: {
    ...TotaraTheme.textRegular,
    marginTop: marginM,
    color: TotaraTheme.colorFont
  },
  listContainer: {
    flexDirection: "row",
    marginRight: marginM,
    justifyContent: "flex-start"
  },
  textLink: {
    justifyContent: "center",
    marginBottom: marginM,
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorLink
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.borderRadiusM,
    alignSelf: "center",
    marginBottom: marginXS,
    backgroundColor: TotaraTheme.colorNeutral5,
    flexWrap: "wrap"
  },
  list: {
    textAlign: "left",
    ...TotaraTheme.textRegular,
    marginRight: marginM,
    marginTop: margins.marginS,
    alignSelf: "flex-start"
  },
  ruler: {
    backgroundColor: TotaraTheme.colorNeutral6,
    marginVertical: margins.marginL,
    height: 0.5
  },
  attachmentTouchable: {
    flexDirection: "column",
    marginVertical: marginS
  },
  attachmentFileName: {
    textAlign: "left",
    ...TotaraTheme.textMedium,
    color: TotaraTheme.colorLink,
    alignSelf: "flex-start"
  },
  webViewWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: borderRadius.borderRadiusM
  }
});

export default wekaEditorStyle;
