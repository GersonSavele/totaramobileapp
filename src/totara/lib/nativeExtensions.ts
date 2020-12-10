import { NativeModules } from "react-native";

const { TotaraExtensions } = NativeModules;

const setNotificationBadgeCount = (count: number) => {
  TotaraExtensions.setNotificationBadgeCount(count);
};
export { setNotificationBadgeCount };
