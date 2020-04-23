import {gutter} from "@totara/theme/index";
import {StyleSheet} from "react-native";

const headerStyles = StyleSheet.create({
  navigationHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: gutter,
    paddingVertical: 8
  }
})

export default headerStyles;