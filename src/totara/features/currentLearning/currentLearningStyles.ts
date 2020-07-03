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

import { StyleSheet, Dimensions, ViewStyle } from "react-native";
import { gutter } from "@totara/theme";
import {
  margins,
  paddings,
  iconSizes,
  borderRadius,
  fontWeights
} from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { spacedFlexRow } from "@totara/lib/styles/base";

const { marginL, marginS, margin2XL } = margins;
const { borderRadiusL, borderRadiusXS, borderRadiusM } = borderRadius;
const {
  colorOpacity70,
  textRegular,
  textH2,
  textSmall,
  textXSmall,
  textXXSmall,
  colorAccent,
  colorNeutral2,
  colorNeutral7,
  colorNeutral8,
  textHeadline,
  textMedium,
  colorSecondary1,
  navigationHeaderTintColor
} = TotaraTheme;

const bottomSheetStyles = StyleSheet.create({
  transparentView: {
    flex: 1,
    backgroundColor: colorOpacity70,
    justifyContent: "flex-end"
  },
  renderOuterViewWrap: {
    marginHorizontal: marginL,
    marginVertical: marginS
  },
  renderInnerViewWrap: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1
  },
  criteriaText: {
    ...textRegular,
    alignSelf: "flex-start"
  },
  requirementText: {
    marginTop: marginS,
    marginBottom: marginL,
    ...textSmall,
    opacity: 0.48,
    alignSelf: "flex-start"
  },
  statusText: {
    ...textXXSmall,
    opacity: 0.48,
    alignSelf: "flex-end"
  },
  headerViewWrap: {
    backgroundColor: colorAccent,
    borderTopLeftRadius: borderRadiusL,
    borderTopRightRadius: borderRadiusL
  },
  headerCloseButtonWrap: {
    marginTop: marginS,
    height: iconSizes.sizeXL,
    width: iconSizes.sizeXL,
    alignItems: "center",
    justifyContent: "center"
  },
  headerInnerViewWrap: {
    flexDirection: "row",
    flex: 1
  },
  headerViewIndicatorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: margin2XL,
    marginTop: marginS
  },
  indicatorWrap: {
    width: "20%",
    height: 5,
    opacity: 0.1,
    borderRadius: borderRadiusXS,
    backgroundColor: colorNeutral8,
    alignSelf: "center"
  },
  nameViewWrap: {
    alignSelf: "flex-start",
    ...textRegular,
    justifyContent: "center"
  },
  bodySeparator: {
    height: 0.5,
    opacity: 0.2
  },
  container: {
    alignItems: "flex-start",
    margin: marginL
  },
  titleWrap: {
    margin: marginL
  },
  renderListWrap: {
    backgroundColor: colorAccent,
    marginBottom: "5%",
    height: "95%"
  },
  availableReasonTitleWrap: {
    ...textHeadline,
    fontWeight: fontWeights.fontWeightBold
  },
  restrictionViewList: {
    backgroundColor: colorAccent,
    height: "100%"
  },
  availableReasonTextWrap: {
    ...textRegular,
    alignSelf: "flex-start",
    color: colorNeutral8,
    backgroundColor: colorAccent,
    marginHorizontal: marginL
  }
});

const parallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  parallaxHeaderContainer: {
    backgroundColor: "transparent",
    overflow: "hidden"
  },
  parallaxHeader: {
    backgroundColor: "transparent",
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute",
    backgroundColor: "transparent",
    overflow: "hidden",
    top: 0
  },
  scrollView: {
    backgroundColor: "transparent"
  }
});

const headerViewStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    maxHeight: 280,
    minHeight: 260,
    backgroundColor: colorNeutral2
  },
  itemImage: {
    minHeight: 160
  },
  itemCard: {
    maxHeight: 85,
    minHeight: 60,
    backgroundColor: colorNeutral2
  },
  LearningTypeLabelWrap: {
    borderRadius: borderRadiusM,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    marginTop: marginS,
    borderColor: colorNeutral7
  },
  tabBarContainer: {
    flex: 0.4,
    height: 50,
    marginTop: marginL
  },
  tabNav: {
    ...spacedFlexRow,
    marginLeft: marginL,
    width: Dimensions.get("window").width * 0.5,
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

const videoControllerStyles = StyleSheet.create({
  mediaPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: borderRadiusM
  }
});

const headerViewTitleWrap = {
  ...textH2
};

const headerViewSubTitleWrap = {
  ...textXSmall,
  color: navigationHeaderTintColor
};

const viewHeader: ViewStyle = {
  paddingHorizontal: gutter,
  paddingVertical: paddings.paddingL
};

const viewStyles = StyleSheet.create({
  viewHeader,
  spinnerContainer: {
    flex: 1,
    justifyContent: "center"
  },
  contentWrap: {
    flex: 1,
    backgroundColor: "transparent"
  },
  headerViewTitleWrap,
  headerViewSubTitleWrap,
  headerViewWrap: {
    ...viewHeader,
    color: colorSecondary1,
    backgroundColor: colorNeutral2
  }
});

const courseStyle = StyleSheet.create({
  expandContentWrap: {
    ...spacedFlexRow,
    margin: marginL
  },
  expandTextWrap: {
    ...textMedium
  },
  scrollView: {
    flex: 1,
    backgroundColor: colorNeutral2
  }
});

export {
  bottomSheetStyles,
  parallaxScrollViewStyles,
  headerViewStyles,
  videoControllerStyles,
  viewStyles,
  courseStyle
};
