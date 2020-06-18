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

import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "@totara/theme";
import { margins, paddings } from "@totara/theme/constants";
import { TotaraTheme, AppliedTheme } from "@totara/theme/Theme";

const gradePrefixText = (theme: AppliedTheme) => {
  return {
    ...theme.textHeadline,
    fontWeight: "bold"
  };
};

const gradeSuffixText = (theme: AppliedTheme) => {
  return {
    ...theme.textSmall,
    ...styles.gradeMaxTextWrap
  };
};

const labelWrap = (theme: AppliedTheme) => {
  return {
    ...theme.textRegular,
    textAlign: "center"
  };
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: paddings.paddingXL,
    paddingBottom: paddings.paddingXL
  },
  container: {
    shadowColor: TotaraTheme.colorNeutral8,
    backgroundColor: TotaraTheme.colorNeutral1,
    borderColor: TotaraTheme.colorNeutral2,
    borderRadius: normalize(10),
    shadowOpacity: 0.16,
    shadowRadius: normalize(14),
    borderWidth: 0.5,
    marginVertical: margins.marginL,
    marginHorizontal: margins.marginXS,
    shadowOffset: {
      width: 0,
      height: 10
    }
  },
  contentWrap: {
    borderRadius: normalize(10),
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  innerViewWrap: {
    marginHorizontal: margins.marginL,
    alignContent: "center",
    justifyContent: "center"
  },
  carouselTextContainer: {
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: margins.marginXL,
    marginHorizontal: margins.marginL,
    maxWidth: Dimensions.get("window").width * 0.6
  },
  gradeMaxTextWrap: {
    fontWeight: "normal",
    alignSelf: "flex-end"
  },
  horizontalSeparator: {
    height: "60%",
    width: 0.5,
    alignSelf: "center",
    backgroundColor: TotaraTheme.colorNeutral5
  },
  summaryContainer: {
    marginLeft: margins.marginL,
    marginRight: margins.marginS,
    marginTop: margins.marginS,
    paddingBottom: paddings.padding3XL
  },
  summaryViewWrap: {
    marginTop: margins.marginL
  },
  badgeContainer: {
    marginLeft: margins.margin2XL,
    marginBottom: margins.margin2XL
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: TotaraTheme.colorOpacity70
  }
});

export { styles, gradePrefixText, gradeSuffixText, labelWrap };
