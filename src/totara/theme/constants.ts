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

import { Dimensions } from "react-native";
import { TotaraTheme } from "@totara/theme/Theme";

const textAttributes = {
  short_code_prefix: "0x"
};

const borderRadius = {
  borderRadiusXS: 4,
  borderRadiusS: 8,
  borderRadiusM: 12,
  borderRadiusL: 16
};

const fontWeights = {
  fontWeightRegular: "400",
  fontWeightNormal: "500",
  fontWeightSemiBold: "600",
  fontWeightBold: "700"
};

const fontSizes = {
  fontSizeXS: 11,
  fontSizeS: 15,
  fontSizeM: 17,
  fontSizeL: 22,
  fontSizeXL: 32,
  fontSize2XL: 58,
  fontSize3XL: 68
};

const margins = {
  marginXS: 6,
  marginS: 8,
  marginM: 12,
  marginL: 16,
  marginXL: 24,
  margin2XL: 32,
  margin3XL: 48
};
const paddings = {
  paddingXS: 2,
  paddingS: 4,
  paddingM: 6,
  paddingL: 8,
  paddingXL: 16,
  padding2XL: 24,
  padding3XL: 32
};

const tabBar = {
  icon: {
    width: 24,
    height: 24
  }
};

const iconSizes = {
  sizeS: 16,
  sizeM: 24,
  sizeL: 32,
  sizeXL: 48
};

const shadow = {
  android: {
    elevation: 6
  },
  ios: {
    shadowColor: TotaraTheme.colorNeutral8,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    shadowOffset: {
      width: 0,
      height: 3
    }
  }
};

const viewHeight = {
  activityContainerHeight: 45,
  learningItemHeaderMinHeight: 260,
  learningItemHeaderMaxHeight: 280,
  learningItemImageMaxHeight: 160,
  learningItemTitleMaxHeight: 85,
  learningItemTitleMinHeight: 60,
  activitySectionHeight: 58
};
const header = {
  icon: {
    size: 24
  }
};

const modalSize = {
  width: Dimensions.get("window").width * 0.7,
  height: Dimensions.get("window").height * 0.7
};

const resultCircleSize = 185;
const resultWrapperScaleX = 2;

export {
  textAttributes,
  margins,
  paddings,
  viewHeight,
  fontSizes,
  fontWeights,
  borderRadius,
  tabBar,
  header,
  iconSizes,
  modalSize,
  resultCircleSize,
  resultWrapperScaleX,
  shadow
};
