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
 */
import { StyleSheet } from "react-native";
import {
  margins,
  paddings,
  borderRadius,
  shadow
} from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
const { marginS, marginXL, marginXS } = margins;
const { borderRadiusM, borderRadiusS } = borderRadius;
const {
  colorNeutral8,
  colorNeutral1,
  colorNeutral3,
  colorNeutral6
} = TotaraTheme;
const { paddingXS, paddingL } = paddings;

const carouselItemStyles = StyleSheet.create({
  container: {
    ...shadow.ios,
    ...shadow.android,
    borderRadius: borderRadiusM,
    backgroundColor: colorNeutral1,
    borderWidth: 1,
    borderColor: colorNeutral3
  },
  content: {
    borderRadius: borderRadiusM,
    width: "100%",
    height: "99%",
    overflow: "hidden"
  },
  type: {
    marginTop: marginS,
    alignSelf: "flex-start",
    paddingHorizontal: paddingL,
    paddingVertical: paddingXS,
    borderWidth: 1,
    borderRadius: borderRadiusS,
    backgroundColor: colorNeutral1,
    color: colorNeutral8,
    borderColor: colorNeutral6,
    ...TotaraTheme.textXXSmall
  },
  summary: {
    flex: 1,
    alignSelf: "flex-start",
    width: "100%",
    paddingVertical: paddingL,
    ...TotaraTheme.textSmall
  },
  badgeContainer: {
    zIndex: 1
  },
  learningItem: {
    zIndex: 2,
    position: "absolute",
    right: 0,
    top: 0
  },
  itemWithBadgeContainer: {
    marginVertical: marginXL,
    marginHorizontal: marginXS
  },
  pagination: {
    borderStyle: "dashed",
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  dot: {
    height: 1.5,
    marginHorizontal: 0,
    backgroundColor: colorNeutral6
  }
});

export default carouselItemStyles;
