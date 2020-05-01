import {StyleSheet} from "react-native";
import {paddings} from "@totara/theme/constants";
import {gutter} from "@totara/theme/index";

const headerStyles = StyleSheet.create({
  navigationHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: gutter,
    paddingVertical: paddings.paddingL
  }
})

export default headerStyles;