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
import { margins, paddings, borderRadius, fontWeights, row, shadow, opacities } from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";
import { spacedFlexRow } from "@totara/lib/styles/base";
import { viewHeight } from "../constants";

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
    backgroundColor: "transparent",
    justifyContent: "space-between"
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
  title: {
    ...TotaraTheme.textHeadline,
    fontWeight: fontWeights.fontWeightBold
  },
  container: {
    ...shadow.ios,
    ...shadow.android,
    borderRadius: borderRadius.borderRadiusM,
    margin: margins.marginL,
    width: deviceScreen.width * 0.8,
    height: viewHeight.LearningItemCard,
    minHeight: 225,
    backgroundColor: TotaraTheme.colorNeutral1
  },
  itemContainer: {
    borderRadius: borderRadius.borderRadiusM,
    width: "100%",
    height: "100%"
  },
  courseSummary: {
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
  courseSetItemImage: {
    borderTopRightRadius: borderRadius.borderRadiusM,
    borderTopLeftRadius: borderRadius.borderRadiusM
  },

  headerBar: {
    borderTopRightRadius: borderRadius.borderRadiusM,
    borderTopLeftRadius: borderRadius.borderRadiusM,
    backgroundColor: TotaraTheme.colorNeutral2,
    height: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: paddings.paddingL
  },
  headerTitle: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightSemiBold
  }
});

const rowItem = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: paddings.paddingM,
    borderRadius: borderRadius.borderRadiusM
  },
  imageWrapper: {
    backgroundColor: TotaraTheme.colorNeutral2,
    padding: paddings.paddingM,
    borderRadius: borderRadius.borderRadiusM
  },
  image: {
    height: row.icon.size,
    width: row.icon.size,
    aspectRatio: 4 / 3
  },
  detailsWrapper: {
    flex: 1,
    padding: paddings.paddingM
  },
  courseName: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightSemiBold
  },
  courseSummary: {
    ...TotaraTheme.textSmall,
    fontWeight: fontWeights.fontWeightNormal,
    opacity: opacities.opacityM
  }
});

const horizontalList = StyleSheet.create({
  container: {
    backgroundColor: TotaraTheme.colorNeutral2,
    paddingTop: paddings.paddingXL,
    paddingBottom: paddings.paddingXL
  },
  listWrapper: {
    ...shadow.ios,
    ...shadow.android,
    marginBottom: margins.marginM,
    borderRadius: borderRadius.borderRadiusM,
    backgroundColor: TotaraTheme.colorNeutral1
  }
});

export { details, courses, courseSet, rowItem, horizontalList };
