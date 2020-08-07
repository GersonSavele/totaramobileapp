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

import { StyleSheet, ViewStyle } from "react-native";
import { margins, paddings, borderRadius } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { deviceScreen } from "@totara/lib/tools";
import { viewHeight } from "./constants";
const { marginL } = margins;
const {
  colorOpacity70,
  textH2,
  textXSmall,
  textXXSmall,
  colorNeutral2,
  colorNeutral7,
  colorSecondary1,
  navigationHeaderTintColor
} = TotaraTheme;

const viewHeader: ViewStyle = {
  padding: paddings.paddingL
};

const learningDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral1
  },
  imageView: {
    flex: 1,
    minHeight: viewHeight.LearningItemCard,

    backgroundColor: colorNeutral2
  },
  itemCard: {
    backgroundColor: colorNeutral2
  },
  learningTypeLabelWrap: {
    borderRadius: borderRadius.borderRadiusM,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    borderColor: colorNeutral7
  },
  tabBarContainer: {
    flex: 0.4,
    height: 50
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: marginL,
    width: deviceScreen.width * 0.5,
    alignItems: "center",
    flex: 1
  },
  programLabelText: {
    ...textXXSmall,
    textAlign: "center",
    paddingLeft: paddings.paddingL,
    paddingRight: paddings.paddingL,
    paddingTop: paddings.paddingXS,
    paddingBottom: paddings.paddingXS,
    color: colorNeutral7
  },
  tabSelected: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: paddings.padding2XL
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: colorOpacity70
  }
});

const currentLearningStyles = StyleSheet.create({
  viewHeader,
  spinnerContainer: {
    flex: 1,
    justifyContent: "center"
  },
  contentWrap: {
    flex: 1,
    backgroundColor: "transparent"
  },
  headerViewTitleWrap: {
    ...textH2
  },
  headerViewSubTitleWrap: {
    ...textXSmall,
    color: navigationHeaderTintColor
  },
  headerViewWrap: {
    ...viewHeader,
    color: colorSecondary1,
    backgroundColor: colorNeutral2
  }
});

export { learningDetailsStyles, currentLearningStyles };
