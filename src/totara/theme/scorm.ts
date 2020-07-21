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

import { gutter } from "./";
import {
  margins,
  fontWeights,
  modalSize,
  resultCircleSize,
  resultWrapperScaleX,
  paddings
} from "./constants";
import { TotaraTheme } from "./Theme";

const scormSummaryStyles = StyleSheet.create({
  expanded: {
    flex: 1,
    flexDirection: "column"
  },
  sectionTitle: {
    flexDirection: "row",
    paddingTop: margins.marginS,
    paddingBottom: margins.marginS,
    justifyContent: "space-between",
    fontWeight: fontWeights.fontWeightBold
  },
  sectionField: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: margins.marginS
  },
  attemptContainer: {
    paddingHorizontal: gutter,
    paddingVertical: margins.marginS,
    flexDirection: "column",
    alignItems: "stretch"
  }
});

const scormAttemptsStyles = StyleSheet.create({
  sectionTitle: {
    marginVertical: margins.marginL,
    paddingHorizontal: paddings.paddingXL,
    fontWeight: fontWeights.fontWeightBold
  },
  holder: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: margins.marginL,
    paddingHorizontal: gutter
  },
  attempt: {
    flex: 2,
    alignSelf: "center",
    fontWeight: "normal"
  },
  result: {
    flex: 1,
    alignItems: "flex-end"
  }
});

const scormFeedbackStyles = StyleSheet.create({
  transparentViewStyle: {
    flex: 1,
    backgroundColor: TotaraTheme.colorOpacity70
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  resultOuterWrapper: {
    flex: 1,
    height: modalSize.height,
    width: modalSize.width,
    borderRadius: 4,
    marginHorizontal: "8%",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: TotaraTheme.colorNeutral1
  },
  resultInnerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    overflow: "hidden",
    backgroundColor: TotaraTheme.colorNeutral3,
    borderBottomStartRadius: modalSize.width * resultWrapperScaleX,
    borderBottomEndRadius: modalSize.width * resultWrapperScaleX,
    transform: [{ scaleX: resultWrapperScaleX }]
  },
  resultContainer: {
    width: resultCircleSize,
    height: resultCircleSize,
    borderRadius: resultCircleSize / 2,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: TotaraTheme.colorNeutral7,
    transform: [{ scaleX: 1 / resultWrapperScaleX }]
  },
  resultStatusImage: {
    alignSelf: "center",
    height: "40%",
    width: "40%",
    resizeMode: "contain"
  },
  resultTitle: {
    textAlign: "center",
    fontWeight: fontWeights.fontWeightSemiBold,
    color: TotaraTheme.textColorLight
  },
  scoreText: {
    textAlign: "center",
    color: TotaraTheme.textColorLight
  },
  actionWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: margins.margin3XL
  },
  actionContainer: {
    alignSelf: "center",
    justifyContent: "space-between",
    alignContent: "space-between"
  }
});
const onlineScormActivityStyles = StyleSheet.create({
  playerContainer: { width: "100%", height: "100%" }
});
export {
  scormSummaryStyles,
  scormFeedbackStyles,
  scormAttemptsStyles,
  onlineScormActivityStyles
};
