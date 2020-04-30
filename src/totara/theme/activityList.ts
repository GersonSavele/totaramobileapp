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

import { StyleSheet } from "react-native";
import { normalize } from "@totara/theme";
import { margins, paddings } from "@totara/theme/constants";

const activityStyles = StyleSheet.create({
    bodyName: {
      alignSelf: "flex-start",
      fontSize: normalize(17),
      fontWeight: "500",
      justifyContent: "center",
    },
    bodyType: {
      alignSelf: "flex-start",
      flex: 2,
      fontSize: normalize(11),
      fontWeight: "600",
    },
    headerViewContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      height: normalize(58),
      marginHorizontal : margins.marginL,
      alignItems: "center",
    },
    accordionListWrap: {
      flexDirection: "column",
    },
    activityBodyContainer: {
      height: normalize(68),
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginHorizontal: margins.marginL
    },
    activityContainer: {
      height: 45,
      justifyContent: "center",
      marginRight: margins.marginL
    },
    activityBodySeparator: {
      height: 0.5,
      opacity: 0.2,
      marginHorizontal: margins.marginL
    },
    notAvailableText: {
      fontWeight: "500",
      borderRadius: 12,
      margin: margins.marginXS,
      fontSize: normalize(11),
      paddingHorizontal: paddings.paddingS,
      textAlign: "center",
    },
  });

  const activityIconStyles = StyleSheet.create({
    container: {
      marginRight: margins.marginL
    },
  });

  export  {activityStyles, activityIconStyles};