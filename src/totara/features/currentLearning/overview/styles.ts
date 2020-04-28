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
import { marginStyle } from "@totara/theme/constants";

const detailsViewStyle = StyleSheet.create({
  container: {
    borderRadius: normalize(10),
    shadowOpacity: 0.16,
    shadowRadius: normalize(14),
    borderWidth: 0.5,
    marginVertical: marginStyle.marginL,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  contentWrap: {
    borderRadius: normalize(10),
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "center",
  },
  innerViewWrap: {
    marginHorizontal: marginStyle.marginL,
    alignContent: "center",
    justifyContent: "center",
  },
  carouselTextContainer: {
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: marginStyle.marginXL,
    marginHorizontal: marginStyle.marginL,
    maxWidth: Dimensions.get("window").width * 0.6,
  },
  gradeMaxTextWrap: {
    fontWeight: "normal",
    alignSelf: "flex-end",
  },
  viewSeparator: {
    height: "60%",
    width: 0.5,
    alignSelf: "center",
  },
  listItemSeparator: {
    margin: marginStyle.marginXS,
  },
  summarySeparator: {
    height: 0.5,
    margin: marginStyle.marginM,
  },
  summaryContainer: {
    marginLeft: marginStyle.marginL,
    marginRight: marginStyle.marginS,
  },
  summaryTitleWrap: {
    marginTop: marginStyle.marginS,
  },
  summaryViewWrap: {
    marginTop: marginStyle.marginL,
  },
});

export { detailsViewStyle };
