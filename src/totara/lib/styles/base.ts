import { StyleProp, ViewStyle } from "react-native";

const spacedFlexRow: StyleProp<ViewStyle> = {
  flexDirection: "row",
  justifyContent: "space-between"
};

const fullFlex = { flex: 1 };

export { spacedFlexRow, fullFlex };
