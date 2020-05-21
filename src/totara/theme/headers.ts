import { StyleSheet } from "react-native";
import { paddings } from "@totara/theme/constants";
import { gutter } from "@totara/theme/index";
import { TotaraTheme } from "@totara/theme/Theme";

const headerStyles = StyleSheet.create({
  navigationHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: gutter,
    paddingVertical: paddings.paddingL,
    backgroundColor: TotaraTheme.colorSecondary1
  }
});

export default headerStyles;
