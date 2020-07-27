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
import {
  margins,
  paddings,
  borderRadius,
  fontWeights,
  iconSizes
} from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { deviceScreen } from "@totara/lib/tools";
import { viewHeight } from "./constants";
const { marginL, marginS, margin2XL } = margins;
const { borderRadiusL, borderRadiusXS } = borderRadius;
const {
  colorOpacity70,
  textH2,
  textXSmall,
  textXXSmall,
  colorNeutral2,
  colorNeutral7,
  colorSecondary1,
  navigationHeaderTintColor,
  textRegular,
  colorAccent,
  colorNeutral8,
  textHeadline
} = TotaraTheme;

const viewHeader: ViewStyle = {
  padding: paddings.paddingL
};

const learningDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral2
  },
  imageView: {
    flex: 1,
    minHeight: viewHeight.LearningItemCard,

    backgroundColor: colorNeutral2
  },
  itemCard: {
    backgroundColor: colorNeutral2
  },
  LearningTypeLabelWrap: {
    borderRadius: borderRadius.borderRadiusM,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    marginTop: marginS,
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

const criteriaSheetStyle = StyleSheet.create({
  transparentView: {
    flex: 1,
    backgroundColor: colorOpacity70,
    justifyContent: "flex-end"
  },
  headerInnerViewWrap: {
    flexDirection: "row",
    flex: 1
  },
  listHeader: {
    ...textHeadline,
    fontWeight: fontWeights.fontWeightBold,
    margin: marginL
  },
  listContent: {
    backgroundColor: colorAccent,
    height: "100%"
  },
  indicatorWrap: {
    width: "20%",
    height: 5,
    opacity: 0.1,
    borderRadius: borderRadiusXS,
    backgroundColor: colorNeutral8,
    alignSelf: "center"
  },
  headerCloseButtonWrap: {
    marginTop: marginS,
    height: iconSizes.sizeXL,
    width: iconSizes.sizeXL,
    alignItems: "center",
    justifyContent: "center"
  },
  headerViewIndicatorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: margin2XL,
    marginTop: marginS
  },
  headerViewWrap: {
    backgroundColor: colorAccent,
    borderTopLeftRadius: borderRadiusL,
    borderTopRightRadius: borderRadiusL
  },
  availableReasonTextWrap: {
    ...textRegular,
    alignSelf: "flex-start",
    color: colorNeutral8,
    backgroundColor: colorAccent,
    margin: marginL
  }
});

export { learningDetailsStyles, currentLearningStyles, criteriaSheetStyle };
