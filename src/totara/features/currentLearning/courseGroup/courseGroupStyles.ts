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
import { TotaraTheme } from "@totara/theme/Theme";
import {
  margins,
  paddings,
  borderRadius,
  fontWeights,
  row
} from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";
import { spacedFlexRow } from "@totara/lib/styles/base";

const details = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral2
  },
  activitiesContainer: {
    flex: 3,
    backgroundColor: TotaraTheme.colorNeutral1
  }
});

const courses = StyleSheet.create({
  bottomView: {
    marginHorizontal: margins.marginXL,
    alignItems: "center",
    marginBottom: margins.marginXL
  },
  button: {
    borderRadius: borderRadius.borderRadiusXS,
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: TotaraTheme.colorAccent,
    borderColor: TotaraTheme.textColorDark
  },
  buttonTextTitle: {
    ...TotaraTheme.textRegular,
    textAlign: "center",
    fontWeight: fontWeights.fontWeightBold,
    paddingHorizontal: paddings.padding3XL,
    paddingVertical: paddings.paddingXL
  },
  unavailableSetWrap: {
    borderRadius: borderRadius.borderRadiusS,
    marginHorizontal: margins.marginL,
    backgroundColor: TotaraTheme.colorNeutral2,
    marginVertical: margins.marginXL
  },
  unavailableText: {
    ...TotaraTheme.textRegular,
    textAlign: "center",
    paddingVertical: paddings.paddingXL
  },
  completedText: {
    ...TotaraTheme.textMedium,
    fontWeight: fontWeights.fontWeightSemiBold
  },
  endNoteText: {
    ...TotaraTheme.textSmall,
    marginVertical: margins.marginL
  },
  nextSet: {
    marginVertical: margins.marginL,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  separator: {
    height: 2,
    flex: 1,
    marginHorizontal: margins.marginL,
    backgroundColor: TotaraTheme.colorNeutral6
  },
  nextSetText: {
    ...TotaraTheme.textXSmall,
    textTransform: "uppercase",
    fontWeight: fontWeights.fontWeightBold
  }
});

const courseSet = StyleSheet.create({
  courseSetHeader: {
    ...spacedFlexRow,
    flex: 1,
    marginHorizontal: margins.marginL
  },
  criteriaButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  title: {
    ...TotaraTheme.textHeadline,
    fontWeight: fontWeights.fontWeightBold
  },
  criteriaButtonTitle: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorInfo
  },
  container: {
    margin: margins.marginL,
    width: deviceScreen.width * 0.8,
    height: deviceScreen.height * 0.3,
    minHeight: 225
  },
  learningItem: {
    borderRadius: borderRadius.borderRadiusM,
    shadowOpacity: 0.1,
    shadowRadius: borderRadius.borderRadiusM,
    shadowColor: TotaraTheme.colorNeutral8,
    backgroundColor: TotaraTheme.colorNeutral1
  },
  itemContainer: {
    borderTopRightRadius: borderRadius.borderRadiusM,
    borderTopLeftRadius: borderRadius.borderRadiusM,
    overflow: "hidden",
    width: "100%",
    height: "100%"
  },
  courseSummery: {
    marginVertical: margins.marginS,
    ...TotaraTheme.textSmall,
    fontWeight: fontWeights.fontWeightNormal
  },
  courseTitle: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightSemiBold,
    marginTop: margins.marginL
  },
  courseDetails: {
    flex: 1,
    marginHorizontal: margins.marginL
  },

  headerBar: {
    backgroundColor: TotaraTheme.colorNeutral2,
    height: 54,
    ...spacedFlexRow,
    alignItems: "flex-end"
  },
  headerTitle: {
    ...TotaraTheme.textRegular,
    marginLeft: margins.marginL,
    marginBottom: margins.marginS,
    fontWeight: fontWeights.fontWeightSemiBold
  },
  criteria: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: margins.marginL,
    marginBottom: margins.marginS
  }
});

const rowItem = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: margins.marginL,
    marginTop: margins.marginL,
    paddingEnd: paddings.paddingXL,
    alignItems: "center"
  },
  imageWrapper: {
    height: row.icon.size,
    width: row.icon.size,
    borderRadius: borderRadius.borderRadiusS
  },
  detailsWrapper: {
    marginHorizontal: margins.marginL,
    marginVertical: margins.marginS,
    alignContent: "center"
  },
  courseName: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightSemiBold
  },
  courseSummary: {
    ...TotaraTheme.textSmall,
    fontWeight: fontWeights.fontWeightNormal,
    opacity: 0.48
  }
});

const horizontalList = StyleSheet.create({
  container: {
    backgroundColor: TotaraTheme.colorNeutral2,
    paddingTop: paddings.padding2XL
  },
  listWrapper: {
    borderRadius: borderRadius.borderRadiusM,
    shadowOpacity: 0.075,
    backgroundColor: TotaraTheme.colorNeutral1
  }
});

export { details, courses, courseSet, rowItem, horizontalList };
