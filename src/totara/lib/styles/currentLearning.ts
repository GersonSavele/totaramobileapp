/*

This file is part of Totara Enterprise.
*
Copyright (C) 2020 onwards Totara Learning Solutions LTD
*
Totara Enterprise is provided only to Totara Learning Solutions
LTD’s customers and partners, pursuant to the terms and
conditions of a separate agreement with Totara Learning
Solutions LTD or its affiliate.
*
If you do not have an agreement with Totara Learning Solutions
LTD, you may not access, use, modify, or distribute this software.
Please contact [sales@totaralearning.com] for more information.
*
*/

import { StyleSheet, Dimensions, ViewStyle } from "react-native";
import { normalize, gutter } from "@totara/theme";
import { margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";

const criteriaSheetStyles = StyleSheet.create({
  transparentView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end"
  },
  renderOuterViewWrap: {
    marginHorizontal: margins.marginL,
    marginVertical: margins.marginS
  },
  renderInnerViewWrap: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1
  },
  criteriaText: {
    fontSize: normalize(17),
    fontWeight: "normal",
    alignSelf: "flex-start"
  },
  requirementText: {
    marginTop: margins.marginS,
    marginBottom: margins.marginL,
    fontSize: normalize(15),
    fontWeight: "normal",
    opacity: 0.48,
    alignSelf: "flex-start"
  },
  statusText: {
    fontSize: normalize(11),
    fontWeight: "normal",
    opacity: 0.48,
    alignSelf: "flex-end"
  },
  headerViewWrap: {
    backgroundColor: "#FFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  headerCloseButtonWrap: {
    marginTop: margins.marginS,
    height: 48,
    width: 48,
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
    marginRight: margins.margin2XL,
    marginTop: margins.marginS
  },
  indicatorWrap: {
    width: "20%",
    height: 5,
    opacity: 0.1,
    borderRadius: 2.5,
    backgroundColor: "#000000",
    alignSelf: "center"
  },
  nameViewWrap: {
    alignSelf: "flex-start",
    fontSize: normalize(17),
    fontWeight: "600",
    justifyContent: "center"
  },
  bodySeparator: {
    height: 0.5,
    opacity: 0.2
  },
  container: {
    alignItems: "flex-start",
    margin: margins.marginL
  },
  titleWrap: {
    margin: margins.marginL
  },
  sectionList: {
    marginBottom: "5%",
    height: "95%"
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
    maxHeight: normalize(280),
    minHeight: normalize(260)
  },
  itemImage: {
    flex: 2.5,
    minHeight: normalize(160)
  },
  itemCard: {
    maxHeight: normalize(80),
    minHeight: normalize(60)
  },
  LearningTypeLabelWrap: {
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    marginTop: margins.marginS
  },
  tabBarContainer: {
    flex: 0.4,
    maxHeight: 50,
    minHeight: 48,
    marginTop: margins.marginL
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: normalize(16),
    width: Dimensions.get("window").width * 0.5,
    alignItems: "center",
    flex: 1
  },
  programLabelText: {
    fontSize: normalize(11),
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
    paddingLeft: paddings.paddingL,
    paddingRight: paddings.paddingL,
    paddingTop: paddings.paddingXS,
    paddingBottom: paddings.paddingXS
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
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
});

const videoControllerStyles = StyleSheet.create({
  mediaPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: normalize(12)
  }
});

const headerViewTitleWrap = {
  ...TotaraTheme.textH1,
  color: TotaraTheme.navigationHeaderTintColor
};

const headerViewSubTitleWrap = {
  ...TotaraTheme.textSmall,
  color: TotaraTheme.navigationHeaderTintColor
};

const viewHeader: ViewStyle = {
  flexDirection: "column",
  justifyContent: "space-between",
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
    color: TotaraTheme.colorSecondary1,
    backgroundColor: TotaraTheme.colorNeutral2
  }
});

export {
  criteriaSheetStyles,
  parallaxScrollViewStyles,
  headerViewStyles,
  videoControllerStyles,
  viewStyles
};
