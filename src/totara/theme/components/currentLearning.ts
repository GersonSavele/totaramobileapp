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

import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "@totara/theme";
import { marginStyle, paddingStyle } from "@totara/theme/constants";

const criteriaSheetStyles = StyleSheet.create({
  transparentView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  renderOuterViewWrap: {
    marginHorizontal: marginStyle.marginL,
    marginVertical: marginStyle.marginS,
  },
  renderInnerViewWrap: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  criteriaText: {
    fontSize: normalize(17),
    fontWeight: "normal",
    alignSelf: "flex-start",
  },
  requirementText: {
    marginTop: marginStyle.marginS,
    marginBottom: marginStyle.marginL,
    fontSize: normalize(15),
    fontWeight: "normal",
    opacity: 0.48,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: normalize(11),
    fontWeight: "normal",
    opacity: 0.48,
    alignSelf: "flex-end",
  },
  headerViewWrap: {
    backgroundColor: "#FFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerCloseButtonWrap: {
    marginTop: marginStyle.marginS,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInnerViewWrap: {
    flexDirection: "row",
    flex: 1,
  },
  headerViewIndicatorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: marginStyle.margin2XL,
    marginTop: marginStyle.marginS,
  },
  indicatorWrap: {
    width: "20%",
    height: 5,
    opacity: 0.1,
    borderRadius: 2.5,
    backgroundColor: "#000000",
    alignSelf: "center",
  },
  nameViewWrap: {
    alignSelf: "flex-start",
    fontSize: normalize(17),
    fontWeight: "600",
    justifyContent: "center",
  },
  bodySeparator: {
    height: 0.5,
    opacity: 0.2,
  },
  container: {
    alignItems: "flex-start",
    margin: marginStyle.marginL,
  },
  titleWrap: {
    margin: marginStyle.marginL,
  },
  sectionList: {
    marginBottom: "5%",
    height: "95%",
  },
});

const parallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  parallaxHeaderContainer: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  parallaxHeader: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    backgroundColor: "transparent",
    overflow: "hidden",
    top: 0,
  },
  scrollView: {
    backgroundColor: "transparent",
  },
});

const headerViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    maxHeight: normalize(280),
    minHeight: normalize(260),
  },
  itemImage: {
    flex: 2.5,
    minHeight: normalize(160),
  },
  itemCard: {
    maxHeight: normalize(80),
    minHeight: normalize(60),
  },
  LearningTypeLabelWrap: {
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center",
    marginTop: marginStyle.marginS,
  },
  tabBarContainer: {
    flex: 0.4,
    maxHeight: 50,
    minHeight: 48,
    marginTop: marginStyle.marginL,
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: normalize(16),
    width: Dimensions.get("window").width * 0.5,
    alignItems: "center",
    flex: 1,
  },
  programLabelText: {
    fontSize: normalize(11),
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
    paddingLeft: paddingStyle.paddingL,
    paddingRight: paddingStyle.paddingL,
    paddingTop: paddingStyle.paddingXS,
    paddingBottom: paddingStyle.paddingXS,
  },
  tabSelected: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: paddingStyle.margin2XL,
  },
});

const videoControllerStyles = StyleSheet.create({
  mediaPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: normalize(12),
  },
});

export {
  criteriaSheetStyles,
  parallaxScrollViewStyles,
  headerViewStyles,
  videoControllerStyles,
};
